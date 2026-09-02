package com.beebank.access;

import jakarta.validation.constraints.NotBlank;

record VerifyPasswordRequest(@NotBlank String password) {
}
