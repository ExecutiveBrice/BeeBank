package com.beebank.balance;

import jakarta.validation.constraints.NotNull;

record CreateBalanceEntryRequest(
        @NotNull Long playerId,
        @NotNull Long failureId
) {
}
