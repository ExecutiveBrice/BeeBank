package com.beebank.balance;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface BalanceEntryRepository extends JpaRepository<BalanceEntry, Long> {

    @Query("""
            select entry from BalanceEntry entry
            join fetch entry.player
            join fetch entry.failure
            order by entry.createdAt desc, entry.id desc
            """)
    List<BalanceEntry> findAllWithDetailsOrderByCreatedAtDesc();
}
