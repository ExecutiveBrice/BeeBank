package com.beebank.balance;

import com.beebank.failure.Failure;
import com.beebank.failure.FailureRepository;
import com.beebank.player.Player;
import com.beebank.player.PlayerRepository;
import jakarta.validation.Valid;
import jakarta.transaction.Transactional;
import java.net.URI;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

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
    @Transactional
    ResponseEntity<BalanceEntryResponse> create(@Valid @RequestBody CreateBalanceEntryRequest request) {
        BalanceEntryCreationDetails details = balanceEntryRepository.findCreationDetails(
                request.playerId(), request.failureId());
        if (details.getPlayerId() == null) {
            throw new ResponseStatusException(NOT_FOUND, "Joueur introuvable.");
        }
        if (details.getFailureId() == null) {
            throw new ResponseStatusException(NOT_FOUND, "Échec introuvable.");
        }

        if (!details.getFailureFreeAmount() && request.amount() != null
                && request.amount().compareTo(details.getFailureAmount()) != 0) {
            throw new ResponseStatusException(BAD_REQUEST, "Le montant de cet échec est fixe.");
        }
        BigDecimal amount = details.getFailureFreeAmount() && request.amount() != null
                ? request.amount() : details.getFailureAmount();

        // References are attached to this transaction and do not trigger a new SELECT.
        Player player = playerRepository.getReferenceById(request.playerId());
        Failure failure = failureRepository.getReferenceById(request.failureId());
        BalanceEntry savedEntry = balanceEntryRepository.save(new BalanceEntry(player, failure, amount));

        return ResponseEntity
                .created(URI.create("/api/balance-entries/" + savedEntry.getId()))
                .body(new BalanceEntryResponse(
                        savedEntry.getId(),
                        details.getPlayerId(),
                        details.getPlayerName(),
                        details.getFailureId(),
                        details.getFailureName(),
                        savedEntry.getAmount(),
                        savedEntry.isPaid(),
                        savedEntry.getCreatedAt()
                ));
    }

    @PatchMapping("/{id}/paid")
    @Transactional
    ResponseEntity<BalanceEntryResponse> markAsPaid(
            @PathVariable Long id,
            @RequestHeader("X-Access-Password") String password
    ) {
        if (!accessPassword.equals(password)) {
            return ResponseEntity.status(401).build();
        }

        BalanceEntry entry = balanceEntryRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Entrée introuvable."));
        entry.markAsPaid();
        BalanceEntry savedEntry = balanceEntryRepository.save(entry);
        return ResponseEntity.ok(BalanceEntryResponse.from(savedEntry));
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
