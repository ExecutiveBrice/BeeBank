package com.beebank.player;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PlayerControllerTest {

    private final PlayerRepository playerRepository = mock(PlayerRepository.class);
    private final PlayerController controller = new PlayerController(playerRepository);

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
}
