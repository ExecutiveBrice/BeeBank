package com.beebank.access;

import org.springframework.data.jpa.repository.JpaRepository;

interface AccessPasswordRepository extends JpaRepository<AccessPassword, Long> {
}
