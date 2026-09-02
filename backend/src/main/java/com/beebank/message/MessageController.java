package com.beebank.message;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepository messageRepository;

    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @GetMapping
    List<MessageResponse> findAll() {
        return messageRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(MessageResponse::from)
                .toList();
    }

    @PostMapping
    ResponseEntity<MessageResponse> create(@Valid @RequestBody CreateMessageRequest request) {
        Message savedMessage = messageRepository.save(new Message(request.text()));
        return ResponseEntity
                .created(URI.create("/api/messages/" + savedMessage.getId()))
                .body(MessageResponse.from(savedMessage));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable Long id) {
        messageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
