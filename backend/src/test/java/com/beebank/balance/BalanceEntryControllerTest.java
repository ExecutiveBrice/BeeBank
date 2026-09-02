package com.beebank.balance;

import com.beebank.failure.Failure;
import com.beebank.failure.FailureRepository;
import com.beebank.player.Player;
import com.beebank.player.PlayerRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class BalanceEntryControllerTest {

    private final BalanceEntryRepository balanceEntryRepository = mock(BalanceEntryRepository.class);
    private final BalanceEntryController controller = new BalanceEntryController(
            balanceEntryRepository,
            mock(PlayerRepository.class),
            mock(FailureRepository.class),
            "secret"
    );

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
