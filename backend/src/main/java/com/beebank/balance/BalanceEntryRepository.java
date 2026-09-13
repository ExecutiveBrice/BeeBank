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

    /**
     * Loads the data needed to return a newly created entry with one database
     * round trip. The single-row derived table lets us distinguish a missing
     * player from a missing failure without issuing two independent lookups.
     */
    @Query(value = """
            select player.id as "playerId",
                   player.name as "playerName",
                   failure.id as "failureId",
                   failure.name as "failureName",
                   failure.amount as "failureAmount",
                   failure.free_amount as "failureFreeAmount"
            from (select 1) as request
            left join player on player.id = :playerId
            left join failure on failure.id = :failureId
            """, nativeQuery = true)
    BalanceEntryCreationDetails findCreationDetails(
            @Param("playerId") Long playerId,
            @Param("failureId") Long failureId
    );
}
