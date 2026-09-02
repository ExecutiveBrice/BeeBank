package com.beebank.message;

import jakarta.validation.constraints.NotBlank;

record CreateMessageRequest(@NotBlank String text) {
}
