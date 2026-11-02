package com.example.demomealcheck.domain.entity;

import com.example.demomealcheck.domain.enums.ApprovalStatus;
import com.example.demomealcheck.domain.enums.AuthProvider;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @JsonIgnore
    @Column(length = 255)
    private String password;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "phone_number", length = 30)
    private String phoneNumber;

    @Column(length = 255)
    private String organization;

    @Column(length = 255)
    private String address;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "requested_role", length = 50)
    private String requestedRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 30)
    @Builder.Default
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    @Column(name = "email_verified", nullable = false)
    @Builder.Default
    private boolean emailVerified = false;

    @Column(name = "email_verification_token", length = 255)
    private String emailVerificationToken;

    @Column(name = "email_verification_token_expiry")
    private Instant emailVerificationTokenExpiry;

    @Column(name = "verified_badge", nullable = false)
    @Builder.Default
    private boolean verifiedBadge = false;

    @Column(name = "badge_requested", nullable = false)
    @Builder.Default
    private boolean badgeRequested = false;

    @Column(name = "badge_request_reason", columnDefinition = "TEXT")
    private String badgeRequestReason;

    @Column(name = "warning_message", columnDefinition = "TEXT")
    private String warningMessage;

    @Column(name = "warning_count", nullable = false)
    @Builder.Default
    private int warningCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean locked = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column(name = "provider_id", length = 150)
    private String providerId;

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
