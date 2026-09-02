package com.beebank.message;

import java.time.Instant;

record MessageResponse(Long id, String text, Instant createdAt) {

    static MessageResponse from(Message message) {
        return new MessageResponse(message.getId(), message.getText(), message.getCreatedAt());
    }
}
