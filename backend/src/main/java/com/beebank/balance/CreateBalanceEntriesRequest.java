package com.beebank.balance;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

record CreateBalanceEntriesRequest(
        @NotNull Long playerId,
        @NotEmpty List<@Valid Selection> selections
) {
    record Selection(
            @NotNull Long failureId,
            @Min(1) int quantity,
            @DecimalMin("0.01") @Digits(integer = 8, fraction = 2) BigDecimal amount
    ) {
    }
}
