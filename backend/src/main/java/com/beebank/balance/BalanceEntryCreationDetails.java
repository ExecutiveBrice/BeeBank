package com.beebank.balance;

import java.math.BigDecimal;

/** Projection returned by the combined player/failure lookup used on creation. */
interface BalanceEntryCreationDetails {

    Long getPlayerId();

    String getPlayerName();

    Long getFailureId();

    String getFailureName();

    BigDecimal getFailureAmount();
}
