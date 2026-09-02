package com.beebank.failure;

import java.math.BigDecimal;

record FailureResponse(Long id, String name, BigDecimal amount) {

    static FailureResponse from(Failure failure) {
        return new FailureResponse(failure.getId(), failure.getName(), failure.getAmount());
    }
}
