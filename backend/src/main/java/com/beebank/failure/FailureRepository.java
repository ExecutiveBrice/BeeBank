package com.beebank.failure;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FailureRepository extends JpaRepository<Failure, Long> {

    List<Failure> findAllByOrderByNameAsc();
}
