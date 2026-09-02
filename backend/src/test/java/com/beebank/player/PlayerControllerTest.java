package com.beebank.player;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.when;

import java.util.Optional;

class PlayerControllerTest {

    private final PlayerRepository playerRepository = mock(PlayerRepository.class);
    private final PlayerController controller = new PlayerController(playerRepository, "secret");

    @Test
    void rejectsAnExistingNameIgnoringCase() {
        when(playerRepository.existsByNameIgnoreCase("Alice")).thenReturn(true);

        assertThatThrownBy(() -> controller.create(new CreatePlayerRequest("  Alice  ")))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("409 CONFLICT")
                .hasMessageContaining("Ce prénom est déjà utilisé.");

        verify(playerRepository, never()).saveAndFlush(org.mockito.ArgumentMatchers.any(Player.class));
    }

    @Test
    void reportsAConflictWhenTheDatabaseRejectsAConcurrentDuplicate() {
        when(playerRepository.saveAndFlush(org.mockito.ArgumentMatchers.any(Player.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate player name"));

        assertThatThrownBy(() -> controller.create(new CreatePlayerRequest("Alice")))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("409 CONFLICT")
                .hasMessageContaining("Ce prénom est déjà utilisé.");
    }

    @Test
    void deletesAPlayerWhenThePasswordIsValid() {
        Player player = new Player("Alice");
        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

        assertThat(controller.delete(1L, "secret").getStatusCode().value()).isEqualTo(204);

        verify(playerRepository).delete(player);
    }

    @Test
    void rejectsPlayerDeletionWhenThePasswordIsInvalid() {
        assertThat(controller.delete(1L, "wrong").getStatusCode().value()).isEqualTo(401);

        verify(playerRepository, never()).findById(1L);
    }
}
