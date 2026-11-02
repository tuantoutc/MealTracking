package com.example.demomealcheck.repository;

import com.example.demomealcheck.domain.enums.ApprovalStatus;
import com.example.demomealcheck.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByEmailVerificationToken(String token);

    long countByApprovalStatus(ApprovalStatus approvalStatus);
    long countByLocked(boolean locked);
    long countByVerifiedBadge(boolean verifiedBadge);
    long countByBadgeRequested(boolean badgeRequested);

    List<User> findByApprovalStatusOrderByCreatedAtDesc(ApprovalStatus approvalStatus);
    List<User> findByBadgeRequestedTrueOrderByCreatedAtDesc();
}
