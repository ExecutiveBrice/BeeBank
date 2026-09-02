package com.beebank.balance;

import java.math.BigDecimal;
import java.time.Instant;

record BalanceEntryResponse(
        Long id,
        Long playerId,
        String playerName,
        Long failureId,
        String failureName,
        BigDecimal failureAmount,
        boolean paid,
        Instant createdAt
) {

    static BalanceEntryResponse from(BalanceEntry entry) {
        return new BalanceEntryResponse(
                entry.getId(),
                entry.getPlayer().getId(),
                entry.getPlayer().getName(),
                entry.getFailure().getId(),
                entry.getFailure().getName(),
                entry.getFailure().getAmount(),
                entry.isPaid(),
                entry.getCreatedAt()
        );
    }
}
