package com.example.demomealcheck.domain.entity;

import com.example.demomealcheck.domain.enums.ClientStatus;
import com.example.demomealcheck.domain.enums.ClientType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "supplier_clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierClient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private User supplier;

    @Column(nullable = false, length = 200)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "client_type", nullable = false, length = 50)
    private ClientType clientType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(name = "representative_name", nullable = false, length = 100)
    private String representativeName;

    @Column(name = "representative_title", length = 100)
    private String representativeTitle;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(name = "contract_number", nullable = false, length = 100)
    private String contractNumber;

    @Column(name = "daily_servings", nullable = false)
    @Builder.Default
    private Integer dailyServings = 0;

    @Column(name = "price_per_serving", nullable = false)
    @Builder.Default
    private Double pricePerServing = 0.0;

    @Column(name = "contract_start_date", nullable = false)
    private LocalDate contractStartDate;

    @Column(name = "contract_end_date", nullable = false)
    private LocalDate contractEndDate;

    @Column(name = "contract_pdf_url", columnDefinition = "TEXT")
    private String contractPdfUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ClientStatus status = ClientStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
