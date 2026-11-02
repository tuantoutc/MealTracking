package com.example.demomealcheck.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "account_warnings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountWarning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private User admin;

    @Column(name = "warning_title", nullable = false, length = 200)
    private String warningTitle;

    @Column(name = "warning_content", nullable = false, columnDefinition = "TEXT")
    private String warningContent;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
