package com.example.demomealcheck.repository;

import com.example.demomealcheck.domain.entity.AccountWarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountWarningRepository extends JpaRepository<AccountWarning, Long> {
    List<AccountWarning> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<AccountWarning> findAllByOrderByCreatedAtDesc();
}
