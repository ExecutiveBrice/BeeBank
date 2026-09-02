package com.beebank.failure;

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
@RequestMapping("/api/failures")
public class FailureController {

    private final FailureRepository failureRepository;
    private final String accessPassword;

    public FailureController(
            FailureRepository failureRepository,
            @Value("${ACCESS_PASSWORD}") String accessPassword
    ) {
        this.failureRepository = failureRepository;
        this.accessPassword = accessPassword;
    }

    @GetMapping
    List<FailureResponse> findAll() {
        return failureRepository.findAllByOrderByNameAsc().stream()
                .map(FailureResponse::from)
                .toList();
    }

    @PostMapping
    ResponseEntity<FailureResponse> create(@Valid @RequestBody CreateFailureRequest request) {
        String name = request.name().trim();
        if (failureRepository.existsByNameIgnoreCase(name)) {
            throw duplicateFailureException();
        }

        Failure savedFailure;
        try {
            savedFailure = failureRepository.saveAndFlush(new Failure(name, request.amount()));
        } catch (DataIntegrityViolationException exception) {
            throw duplicateFailureException();
        }

        return ResponseEntity
                .created(URI.create("/api/failures/" + savedFailure.getId()))
                .body(FailureResponse.from(savedFailure));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestHeader("X-Access-Password") String password
    ) {
        if (!accessPassword.equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Failure failure = failureRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Échec introuvable."));
        failureRepository.delete(failure);
        return ResponseEntity.noContent().build();
    }

    private ResponseStatusException duplicateFailureException() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Ce nom d’échec est déjà utilisé.");
    }
}
