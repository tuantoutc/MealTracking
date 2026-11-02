package com.example.demomealcheck.dto.response;

import com.example.demomealcheck.domain.entity.FoodPartner;
import com.example.demomealcheck.domain.enums.PartnerCategory;
import com.example.demomealcheck.domain.enums.PartnerStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodPartnerResponse {

    private Long id;
    private Long supplierId;
    private String supplierName;
    private String name;
    private PartnerCategory category;
    private String categoryDescription;
    private String representative;
    private String phone;
    private String email;
    private String address;
    private String suppliedProducts;
    private String contractNumber;
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private String certifications;
    private String certificateFiles;
    private PartnerStatus status;
    private String statusDescription;
    private boolean isExpiringSoon;
    private Long daysUntilExpiration;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;

    public static FoodPartnerResponse fromEntity(FoodPartner entity) {
        if (entity == null) return null;

        boolean expiringSoon = false;
        Long daysLeft = null;
        if (entity.getContractEndDate() != null) {
            java.time.LocalDate today = java.time.LocalDate.now();
            daysLeft = java.time.temporal.ChronoUnit.DAYS.between(today, entity.getContractEndDate());
            if (daysLeft >= 0 && daysLeft <= 30 && entity.getStatus() == PartnerStatus.ACTIVE) {
                expiringSoon = true;
            }
        }

        return FoodPartnerResponse.builder()
                .id(entity.getId())
                .supplierId(entity.getSupplier() != null ? entity.getSupplier().getId() : null)
                .supplierName(entity.getSupplier() != null ? entity.getSupplier().getFullName() : null)
                .name(entity.getName())
                .category(entity.getCategory())
                .categoryDescription(entity.getCategory() != null ? entity.getCategory().getDescription() : null)
                .representative(entity.getRepresentative())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .address(entity.getAddress())
                .suppliedProducts(entity.getSuppliedProducts())
                .contractNumber(entity.getContractNumber())
                .contractStartDate(entity.getContractStartDate())
                .contractEndDate(entity.getContractEndDate())
                .certifications(entity.getCertifications())
                .certificateFiles(entity.getCertificateFiles())
                .status(entity.getStatus())
                .statusDescription(entity.getStatus() != null ? entity.getStatus().getDescription() : null)
                .isExpiringSoon(expiringSoon)
                .daysUntilExpiration(daysLeft)
                .notes(entity.getNotes())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
