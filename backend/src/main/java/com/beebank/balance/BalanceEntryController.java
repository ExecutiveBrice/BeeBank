package com.beebank.balance;

import com.beebank.failure.Failure;
import com.beebank.failure.FailureRepository;
import com.beebank.player.Player;
import com.beebank.player.PlayerRepository;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/balance-entries")
public class BalanceEntryController {

    private final BalanceEntryRepository balanceEntryRepository;
    private final PlayerRepository playerRepository;
    private final FailureRepository failureRepository;
    private final String accessPassword;

    public BalanceEntryController(
            BalanceEntryRepository balanceEntryRepository,
            PlayerRepository playerRepository,
            FailureRepository failureRepository,
            @Value("${ACCESS_PASSWORD}") String accessPassword
    ) {
        this.balanceEntryRepository = balanceEntryRepository;
        this.playerRepository = playerRepository;
        this.failureRepository = failureRepository;
        this.accessPassword = accessPassword;
    }

    @GetMapping
    List<BalanceEntryResponse> findAll() {
        return balanceEntryRepository.findAllWithDetailsOrderByCreatedAtDesc().stream()
                .map(BalanceEntryResponse::from)
                .toList();
    }

    @PostMapping
    ResponseEntity<BalanceEntryResponse> create(@Valid @RequestBody CreateBalanceEntryRequest request) {
        Player player = playerRepository.findById(request.playerId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Joueur introuvable."));
        Failure failure = failureRepository.findById(request.failureId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Échec introuvable."));
        BalanceEntry savedEntry = balanceEntryRepository.save(new BalanceEntry(player, failure));

        return ResponseEntity
                .created(URI.create("/api/balance-entries/" + savedEntry.getId()))
                .body(BalanceEntryResponse.from(savedEntry));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestHeader("X-Access-Password") String password
    ) {
        if (!accessPassword.equals(password)) {
            return ResponseEntity.status(401).build();
        }

        BalanceEntry entry = balanceEntryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Entrée introuvable."));
        balanceEntryRepository.delete(entry);
        return ResponseEntity.noContent().build();
    }
}
