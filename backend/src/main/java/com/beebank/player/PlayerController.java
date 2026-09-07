package com.beebank.player;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerRepository playerRepository;
    private final String accessPassword;

    public PlayerController(
            PlayerRepository playerRepository,
            @Value("${ACCESS_PASSWORD}") String accessPassword
    ) {
        this.playerRepository = playerRepository;
        this.accessPassword = accessPassword;
    }

    @GetMapping
    List<PlayerResponse> findAll() {
        return playerRepository.findAllByOrderByNameAsc().stream()
                .map(PlayerResponse::from)
                .toList();
    }

    @PostMapping
    ResponseEntity<PlayerResponse> create(@Valid @RequestBody CreatePlayerRequest request) {
        String name = request.name().trim();
        Player savedPlayer;
        try {
            savedPlayer = playerRepository.saveAndFlush(new Player(name));
        } catch (DataIntegrityViolationException exception) {
            throw duplicatePlayerException();
        }

        return ResponseEntity
                .created(URI.create("/api/players/" + savedPlayer.getId()))
                .body(PlayerResponse.from(savedPlayer));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestHeader("X-Access-Password") String password
    ) {
        if (!accessPassword.equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Joueur introuvable."));
        playerRepository.delete(player);
        return ResponseEntity.noContent().build();
    }

    private ResponseStatusException duplicatePlayerException() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Ce prénom est déjà utilisé.");
    }
}
