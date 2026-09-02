package com.beebank.access;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/access")
public class AccessController {

    private static final long ACCESS_PASSWORD_ID = 1L;

    private final AccessPasswordRepository accessPasswordRepository;

    public AccessController(AccessPasswordRepository accessPasswordRepository) {
        this.accessPasswordRepository = accessPasswordRepository;
    }

    @PostMapping("/verify")
    AccessResponse verify(@Valid @RequestBody VerifyPasswordRequest request) {
        boolean authorized = accessPasswordRepository.findById(ACCESS_PASSWORD_ID)
                .map(accessPassword -> accessPassword.getPassword().equals(request.password()))
                .orElse(false);
        return new AccessResponse(authorized);
    }
}
