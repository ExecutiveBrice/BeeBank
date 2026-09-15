package com.beebank.balance;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

public record BalanceEntryBatchRequest(
        @NotEmpty List<@NotNull @Positive Long> ids
) {
}
