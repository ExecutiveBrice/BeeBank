package com.beebank.player;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerRepository playerRepository;

    public PlayerController(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
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
        if (playerRepository.existsByNameIgnoreCase(name)) {
            throw duplicatePlayerException();
        }

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

    private ResponseStatusException duplicatePlayerException() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Ce prénom est déjà utilisé.");
    }
}
