package com.beebank.balance;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import java.math.BigDecimal;

record CreateBalanceEntryRequest(
        @NotNull Long playerId,
        @NotNull Long failureId,
        @DecimalMin(value = "0.01") @Digits(integer = 8, fraction = 2) BigDecimal amount
) {
}
