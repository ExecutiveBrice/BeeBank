package com.beebank.player;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

record CreatePlayerRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 100) String team
) {
}
