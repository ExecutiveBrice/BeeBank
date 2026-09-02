package com.beebank.access;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/access")
public class AccessController {

    private final String accessPassword;

    public AccessController(@Value("${ACCESS_PASSWORD}") String accessPassword) {
        this.accessPassword = accessPassword;
    }

    @PostMapping("/verify")
    AccessResponse verify(@Valid @RequestBody VerifyPasswordRequest request) {
        boolean authorized = accessPassword.equals(request.password());
        return new AccessResponse(authorized);
    }
}
