package com.beebank.balance;

import com.beebank.failure.Failure;
import com.beebank.player.Player;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "balance_entry")
public class BalanceEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "failure_id", nullable = false)
    private Failure failure;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected BalanceEntry() {
    }

    public BalanceEntry(Player player, Failure failure) {
        this.player = player;
        this.failure = failure;
    }

    @PrePersist
    void setCreatedAt() {
        createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public Player getPlayer() {
        return player;
    }

    public Failure getFailure() {
        return failure;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
