package com.beebank.failure;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

class FailureControllerTest {

    private final FailureRepository failureRepository = mock(FailureRepository.class);
    private final FailureController controller = new FailureController(failureRepository, "secret");

    @Test
    void createsAFailureWithoutCheckingForDuplicatesFirst() {
        when(failureRepository.saveAndFlush(any(Failure.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = controller.create(new CreateFailureRequest("  Retard  ", new BigDecimal("5.00"), false));

        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody().name()).isEqualTo("Retard");
        assertThat(response.getBody().freeAmount()).isFalse();
        verify(failureRepository).saveAndFlush(any(Failure.class));
    }

    @Test
    void reportsAConflictWhenTheDatabaseRejectsAConcurrentDuplicate() {
        when(failureRepository.saveAndFlush(any(Failure.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate failure name"));

        assertThatThrownBy(() -> controller.create(new CreateFailureRequest("Retard", new BigDecimal("5.00"), false)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("409 CONFLICT")
                .hasMessageContaining("Ce nom d’échec est déjà utilisé.");
    }

    @Test
    void createsAFailureWithAFreeAmountAndKeepsItsDefaultAmount() {
        when(failureRepository.saveAndFlush(any(Failure.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = controller.create(new CreateFailureRequest("Retard", new BigDecimal("5.00"), true));

        assertThat(response.getBody().freeAmount()).isTrue();
        assertThat(response.getBody().amount()).isEqualByComparingTo("5.00");
    }

    @Test
    void deletesAFailureWhenThePasswordIsValid() {
        Failure failure = new Failure("Retard", new BigDecimal("5.00"));
        when(failureRepository.findById(1L)).thenReturn(Optional.of(failure));

        assertThat(controller.delete(1L, "secret").getStatusCode().value()).isEqualTo(204);

        verify(failureRepository).delete(failure);
    }

    @Test
    void rejectsFailureDeletionWhenThePasswordIsInvalid() {
        assertThat(controller.delete(1L, "wrong").getStatusCode().value()).isEqualTo(401);

        verify(failureRepository, never()).findById(1L);
    }
}
