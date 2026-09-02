package com.beebank.message;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findAllByOrderByCreatedAtDesc();
}
