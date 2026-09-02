package com.beebank.failure;

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
@RequestMapping("/api/failures")
public class FailureController {

    private final FailureRepository failureRepository;

    public FailureController(FailureRepository failureRepository) {
        this.failureRepository = failureRepository;
    }

    @GetMapping
    List<FailureResponse> findAll() {
        return failureRepository.findAllByOrderByNameAsc().stream()
                .map(FailureResponse::from)
                .toList();
    }

    @PostMapping
    ResponseEntity<FailureResponse> create(@Valid @RequestBody CreateFailureRequest request) {
        Failure savedFailure = failureRepository.save(new Failure(request.name().trim(), request.amount()));
        return ResponseEntity
                .created(URI.create("/api/failures/" + savedFailure.getId()))
                .body(FailureResponse.from(savedFailure));
    }
}
