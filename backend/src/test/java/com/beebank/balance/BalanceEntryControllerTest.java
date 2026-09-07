package com.beebank.balance;

import com.beebank.failure.Failure;
import com.beebank.failure.FailureRepository;
import com.beebank.player.Player;
import com.beebank.player.PlayerRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
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

        var response = controller.create(new CreateBalanceEntryRequest(1L, 2L));

        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody().playerName()).isEqualTo("Alice");
        assertThat(response.getBody().failureName()).isEqualTo("Retard");
        verify(balanceEntryRepository).findCreationDetails(1L, 2L);
        verify(playerRepository).getReferenceById(1L);
        verify(failureRepository).getReferenceById(2L);
        verify(playerRepository, never()).findById(any());
        verify(failureRepository, never()).findById(any());
    }

    @Test
    void refusesToCreateAnEntryWhenThePlayerDoesNotExist() {
        BalanceEntryCreationDetails details = mock(BalanceEntryCreationDetails.class);
        when(balanceEntryRepository.findCreationDetails(1L, 2L)).thenReturn(details);

        var exception = org.assertj.core.api.Assertions.catchThrowable(
                () -> controller.create(new CreateBalanceEntryRequest(1L, 2L))
        );

        assertThat(exception).isInstanceOf(ResponseStatusException.class);
        assertThat(((ResponseStatusException) exception).getStatusCode().value()).isEqualTo(404);
        verify(playerRepository, never()).getReferenceById(any());
        verify(failureRepository, never()).getReferenceById(any());
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
}
