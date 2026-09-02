package com.beebank.player;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        Player savedPlayer = playerRepository.save(new Player(request.name().trim(), request.team().trim()));
        return ResponseEntity
                .created(URI.create("/api/players/" + savedPlayer.getId()))
                .body(PlayerResponse.from(savedPlayer));
    }
}
