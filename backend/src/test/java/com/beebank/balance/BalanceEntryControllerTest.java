package com.beebank.balance;

import com.beebank.failure.Failure;
import com.beebank.failure.FailureRepository;
import com.beebank.player.Player;
import com.beebank.player.PlayerRepository;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.mockito.ArgumentMatchers.any;

class BalanceEntryControllerTest {

    private final BalanceEntryRepository balanceEntryRepository = mock(BalanceEntryRepository.class);
    private final PlayerRepository playerRepository = mock(PlayerRepository.class);
    private final FailureRepository failureRepository = mock(FailureRepository.class);
    private final BalanceEntryController controller = new BalanceEntryController(
            balanceEntryRepository,
            playerRepository,
            failureRepository,
            "secret"
    );

    @Test
    void createsAnEntryAfterOneCombinedLookup() {
        Player player = new Player("Alice");
        Failure failure = new Failure("Retard", new BigDecimal("2.50"));
        BalanceEntryCreationDetails details = mock(BalanceEntryCreationDetails.class);
        when(details.getPlayerId()).thenReturn(1L);
        when(details.getPlayerName()).thenReturn("Alice");
        when(details.getFailureId()).thenReturn(2L);
        when(details.getFailureName()).thenReturn("Retard");
        when(details.getFailureAmount()).thenReturn(new BigDecimal("2.50"));
        when(balanceEntryRepository.findCreationDetails(1L, 2L)).thenReturn(details);
        when(playerRepository.getReferenceById(1L)).thenReturn(player);
        when(failureRepository.getReferenceById(2L)).thenReturn(failure);
        when(balanceEntryRepository.save(any(BalanceEntry.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = controller.create(new CreateBalanceEntryRequest(1L, 2L, null));

        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody().playerName()).isEqualTo("Alice");
        assertThat(response.getBody().failureName()).isEqualTo("Retard");
        assertThat(response.getBody().failureAmount()).isEqualByComparingTo("2.50");
        verify(balanceEntryRepository).findCreationDetails(1L, 2L);
        verify(playerRepository).getReferenceById(1L);
        verify(failureRepository).getReferenceById(2L);
        verify(playerRepository, never()).findById(any());
        verify(failureRepository, never()).findById(any());
    }

    @Test
    void refusesToCreateAnEntryWhenThePlayerDoesNotExist() {
        BalanceEntryCreationDetails details = mock(BalanceEntryCreationDetails.class);
        when(details.getPlayerId()).thenReturn(null);
        when(balanceEntryRepository.findCreationDetails(1L, 2L)).thenReturn(details);

        var exception = org.assertj.core.api.Assertions.catchThrowable(
                () -> controller.create(new CreateBalanceEntryRequest(1L, 2L, null))
        );

        assertThat(exception).isInstanceOf(ResponseStatusException.class);
        assertThat(((ResponseStatusException) exception).getStatusCode().value()).isEqualTo(404);
        verify(playerRepository, never()).getReferenceById(any());
        verify(failureRepository, never()).getReferenceById(any());
    }

    @Test
    void storesTheChosenAmountAndReturnsItWhenListingAndPayingTheEntry() {
        prepareCreation(true);

        var response = controller.create(new CreateBalanceEntryRequest(1L, 2L, new BigDecimal("7.25")));
        assertThat(response.getBody().failureAmount()).isEqualByComparingTo("7.25");

        var captor = org.mockito.ArgumentCaptor.forClass(BalanceEntry.class);
        verify(balanceEntryRepository).save(captor.capture());
        BalanceEntry entry = captor.getValue();
        assertThat(entry.getAmount()).isEqualByComparingTo("7.25");
        assertThat(entry.getFailure().getAmount()).isEqualByComparingTo("2.50");
        when(balanceEntryRepository.findAllWithDetailsOrderByCreatedAtDesc()).thenReturn(java.util.List.of(entry));
        assertThat(controller.findAll().getFirst().failureAmount()).isEqualByComparingTo("7.25");

        when(balanceEntryRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(entry));
        var paid = controller.markAsPaid(1L, "secret").getBody();
        assertThat(paid.paid()).isTrue();
        assertThat(paid.failureAmount()).isEqualByComparingTo("7.25");
    }

    @Test
    void usesTheDefaultAmountWhenNoCustomAmountIsProvidedForAFreeFailure() {
        prepareCreation(true);

        var response = controller.create(new CreateBalanceEntryRequest(1L, 2L, null));

        assertThat(response.getBody().failureAmount()).isEqualByComparingTo("2.50");
    }

    @Test
    void rejectsACustomAmountForAFixedFailure() {
        prepareCreation(false);

        org.assertj.core.api.Assertions.assertThatThrownBy(
                () -> controller.create(new CreateBalanceEntryRequest(1L, 2L, new BigDecimal("7.25"))))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400 BAD_REQUEST");
        verify(balanceEntryRepository, never()).save(any());
    }

    @Test
    void createsAllSelectedFinesWithTheRequestedQuantitiesAndAmounts() {
        prepareCreation(false);
        BalanceEntryCreationDetails editableDetails = mock(BalanceEntryCreationDetails.class);
        when(editableDetails.getPlayerId()).thenReturn(1L);
        when(editableDetails.getPlayerName()).thenReturn("Alice");
        when(editableDetails.getFailureId()).thenReturn(3L);
        when(editableDetails.getFailureName()).thenReturn("Matériel");
        when(editableDetails.getFailureAmount()).thenReturn(new BigDecimal("5.00"));
        when(editableDetails.getFailureFreeAmount()).thenReturn(true);
        when(balanceEntryRepository.findCreationDetails(1L, 3L)).thenReturn(editableDetails);
        when(failureRepository.getReferenceById(3L))
                .thenReturn(new Failure("Matériel", new BigDecimal("5.00"), true));

        var response = controller.createBatch(new CreateBalanceEntriesRequest(1L, List.of(
                new CreateBalanceEntriesRequest.Selection(2L, 3, null),
                new CreateBalanceEntriesRequest.Selection(3L, 1, new BigDecimal("7.25"))
        )));

        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody()).hasSize(4);
        assertThat(response.getBody().stream().map(BalanceEntryResponse::failureAmount).toList())
                .containsExactly(new BigDecimal("2.50"), new BigDecimal("2.50"),
                        new BigDecimal("2.50"), new BigDecimal("7.25"));
        var captor = org.mockito.ArgumentCaptor.forClass(BalanceEntry.class);
        verify(balanceEntryRepository, org.mockito.Mockito.times(4)).save(captor.capture());
        assertThat(captor.getAllValues().getLast().getAmount()).isEqualByComparingTo("7.25");
    }

    @Test
    void rejectsMultipleCopiesOfAnEditableFineBeforeSavingAnything() {
        prepareCreation(true);

        org.assertj.core.api.Assertions.assertThatThrownBy(() -> controller.createBatch(
                new CreateBalanceEntriesRequest(1L, List.of(
                        new CreateBalanceEntriesRequest.Selection(2L, 2, new BigDecimal("7.25"))
                ))))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400 BAD_REQUEST");
        verify(balanceEntryRepository, never()).save(any());
    }

    @Test
    void validatesEveryBatchItemBeforeSaving() {
        prepareCreation(false);
        BalanceEntryCreationDetails missingDetails = mock(BalanceEntryCreationDetails.class);
        when(missingDetails.getPlayerId()).thenReturn(1L);
        when(missingDetails.getFailureId()).thenReturn(null);
        when(balanceEntryRepository.findCreationDetails(1L, 3L)).thenReturn(missingDetails);

        org.assertj.core.api.Assertions.assertThatThrownBy(() -> controller.createBatch(
                new CreateBalanceEntriesRequest(1L, List.of(
                        new CreateBalanceEntriesRequest.Selection(2L, 2, null),
                        new CreateBalanceEntriesRequest.Selection(3L, 1, null)
                ))))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("404 NOT_FOUND");
        verify(balanceEntryRepository, never()).save(any());
    }

    @Test
    void validatesCustomAmountsAndAllowsOmittingTheAmount() {
        try (var factory = jakarta.validation.Validation.buildDefaultValidatorFactory()) {
            var validator = factory.getValidator();
            for (String invalid : java.util.List.of("0", "-1", "1.001", "100000000")) {
                assertThat(validator.validate(new CreateBalanceEntryRequest(1L, 2L, new BigDecimal(invalid))))
                        .isNotEmpty();
            }
            assertThat(validator.validate(new CreateBalanceEntryRequest(1L, 2L, new BigDecimal("7.25")))).isEmpty();
            assertThat(validator.validate(new CreateBalanceEntryRequest(1L, 2L, null))).isEmpty();
        }
    }

    private void prepareCreation(boolean freeAmount) {
        BalanceEntryCreationDetails details = mock(BalanceEntryCreationDetails.class);
        when(details.getPlayerId()).thenReturn(1L);
        when(details.getPlayerName()).thenReturn("Alice");
        when(details.getFailureId()).thenReturn(2L);
        when(details.getFailureName()).thenReturn("Retard");
        when(details.getFailureAmount()).thenReturn(new BigDecimal("2.50"));
        when(details.getFailureFreeAmount()).thenReturn(freeAmount);
        when(balanceEntryRepository.findCreationDetails(1L, 2L)).thenReturn(details);
        when(playerRepository.getReferenceById(1L)).thenReturn(new Player("Alice"));
        when(failureRepository.getReferenceById(2L))
                .thenReturn(new Failure("Retard", new BigDecimal("2.50"), freeAmount));
        when(balanceEntryRepository.save(any(BalanceEntry.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void marksAnEntryAsPaidWhenThePasswordIsValid() {
        BalanceEntry entry = new BalanceEntry(
                new Player("Alice"),
                new Failure("Retard", new BigDecimal("2.50"))
        );
        when(balanceEntryRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(entry));
        when(balanceEntryRepository.save(entry)).thenReturn(entry);

        var response = controller.markAsPaid(1L, "secret");

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody().paid()).isTrue();
        verify(balanceEntryRepository).save(entry);
    }

    @Test
    void refusesToMarkAnEntryAsPaidWhenThePasswordIsInvalid() {
        assertThat(controller.markAsPaid(1L, "wrong").getStatusCode().value()).isEqualTo(401);

        verify(balanceEntryRepository, never()).findByIdWithDetails(1L);
    }

    @Test
    void paysAllSelectedEntriesWithOneAuthorizedRequest() {
        BalanceEntry first = new BalanceEntry(new Player("Alice"), new Failure("Retard", new BigDecimal("2.50")));
        BalanceEntry second = new BalanceEntry(new Player("Bob"), new Failure("Oubli", new BigDecimal("3.00")));
        when(balanceEntryRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(first));
        when(balanceEntryRepository.findByIdWithDetails(2L)).thenReturn(Optional.of(second));
        when(balanceEntryRepository.saveAll(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var response = controller.markBatchAsPaid(new BalanceEntryBatchRequest(List.of(1L, 2L)), "secret");

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).hasSize(2).allMatch(BalanceEntryResponse::paid);
        verify(balanceEntryRepository).saveAll(List.of(first, second));
    }

    @Test
    void refusesToPayTheBatchIfAnEntryIsMissingOrAlreadyPaid() {
        BalanceEntry first = new BalanceEntry(new Player("Alice"), new Failure("Retard", new BigDecimal("2.50")));
        when(balanceEntryRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(first));
        assertThat(org.assertj.core.api.Assertions.catchThrowable(() -> controller.markBatchAsPaid(
                new BalanceEntryBatchRequest(List.of(1L, 2L)), "secret")))
                .isInstanceOf(ResponseStatusException.class);
        assertThat(first.isPaid()).isFalse();
        verify(balanceEntryRepository, never()).saveAll(any());

        first.markAsPaid();
        assertThat(org.assertj.core.api.Assertions.catchThrowable(() -> controller.markBatchAsPaid(
                new BalanceEntryBatchRequest(List.of(1L)), "secret")))
                .isInstanceOf(ResponseStatusException.class);
        verify(balanceEntryRepository, never()).saveAll(any());
    }

    @Test
    void deletesAllSelectedEntriesOnlyAfterValidatingEveryId() {
        BalanceEntry first = new BalanceEntry(new Player("Alice"), new Failure("Retard", new BigDecimal("2.50")));
        BalanceEntry second = new BalanceEntry(new Player("Bob"), new Failure("Oubli", new BigDecimal("3.00")));
        when(balanceEntryRepository.findById(1L)).thenReturn(Optional.of(first));
        when(balanceEntryRepository.findById(2L)).thenReturn(Optional.of(second));

        assertThat(controller.deleteBatch(new BalanceEntryBatchRequest(List.of(1L, 2L)), "secret")
                .getStatusCode().value()).isEqualTo(204);
        verify(balanceEntryRepository).deleteAll(List.of(first, second));

        assertThat(org.assertj.core.api.Assertions.catchThrowable(() -> controller.deleteBatch(
                new BalanceEntryBatchRequest(List.of(1L, 3L)), "secret")))
                .isInstanceOf(ResponseStatusException.class);
        verify(balanceEntryRepository, times(1)).deleteAll(any());
    }

    @Test
    void rejectsUnauthorizedOrDuplicateBatchOperations() {
        var request = new BalanceEntryBatchRequest(List.of(1L, 2L));
        assertThat(controller.markBatchAsPaid(request, "wrong").getStatusCode().value()).isEqualTo(401);
        assertThat(controller.deleteBatch(request, "wrong").getStatusCode().value()).isEqualTo(401);
        assertThat(org.assertj.core.api.Assertions.catchThrowable(() -> controller.deleteBatch(
                new BalanceEntryBatchRequest(List.of(1L, 1L)), "secret")))
                .isInstanceOf(ResponseStatusException.class);
        verify(balanceEntryRepository, never()).findById(any());
        verify(balanceEntryRepository, never()).findByIdWithDetails(any());
    }

    @Test
    void validatesBatchIds() {
        try (var factory = jakarta.validation.Validation.buildDefaultValidatorFactory()) {
            var validator = factory.getValidator();
            assertThat(validator.validate(new BalanceEntryBatchRequest(List.of()))).isNotEmpty();
            assertThat(validator.validate(new BalanceEntryBatchRequest(List.of(0L)))).isNotEmpty();
            assertThat(validator.validate(new BalanceEntryBatchRequest(List.of(1L, 2L)))).isEmpty();
        }
    }
}
