package com.example.demomealcheck.domain.entity;

import com.example.demomealcheck.domain.enums.PartnerCategory;
import com.example.demomealcheck.domain.enums.PartnerStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "supplier_food_partners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private User supplier;

    @Column(nullable = false, length = 200)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private PartnerCategory category;

    @Column(length = 100)
    private String representative;

    @Column(length = 30)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(name = "supplied_products", nullable = false, columnDefinition = "TEXT")
    private String suppliedProducts;

    @Column(name = "contract_number", length = 100)
    private String contractNumber;

    @Column(name = "contract_start_date")
    private LocalDate contractStartDate;

    @Column(name = "contract_end_date")
    private LocalDate contractEndDate;

    @Column(columnDefinition = "TEXT")
    private String certifications;

    @Column(name = "certificate_files", columnDefinition = "TEXT")
    private String certificateFiles;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PartnerStatus status = PartnerStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
