package com.beebank.balance;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface BalanceEntryRepository extends JpaRepository<BalanceEntry, Long> {

    @Query("""
            select entry from BalanceEntry entry
            join fetch entry.player
            join fetch entry.failure
            order by entry.createdAt desc, entry.id desc
            """)
    List<BalanceEntry> findAllWithDetailsOrderByCreatedAtDesc();

    @Query("""
            select entry from BalanceEntry entry
            join fetch entry.player
            join fetch entry.failure
            where entry.id = :id
            """)
    Optional<BalanceEntry> findByIdWithDetails(@Param("id") Long id);
}
