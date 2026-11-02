package com.example.demomealcheck.dto.response;

import com.example.demomealcheck.domain.entity.SupplierClient;
import com.example.demomealcheck.domain.enums.ClientStatus;
import com.example.demomealcheck.domain.enums.ClientType;
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
public class SupplierClientResponse {

    private Long id;
    private Long supplierId;
    private String supplierName;
    private String name;
    private ClientType clientType;
    private String clientTypeDescription;
    private String address;
    private String representativeName;
    private String representativeTitle;
    private String phone;
    private String email;
    private String contractNumber;
    private Integer dailyServings;
    private Double pricePerServing;
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private String contractPdfUrl;
    private ClientStatus status;
    private String statusDescription;
    private boolean isExpiringSoon;
    private Long daysUntilExpiration;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;

    public static SupplierClientResponse fromEntity(SupplierClient entity) {
        if (entity == null) return null;

        boolean expiringSoon = false;
        Long daysLeft = null;
        if (entity.getContractEndDate() != null) {
            java.time.LocalDate today = java.time.LocalDate.now();
            daysLeft = java.time.temporal.ChronoUnit.DAYS.between(today, entity.getContractEndDate());
            if (daysLeft >= 0 && daysLeft <= 30 && entity.getStatus() == ClientStatus.ACTIVE) {
                expiringSoon = true;
            }
        }

        return SupplierClientResponse.builder()
                .id(entity.getId())
                .supplierId(entity.getSupplier() != null ? entity.getSupplier().getId() : null)
                .supplierName(entity.getSupplier() != null ? entity.getSupplier().getFullName() : null)
                .name(entity.getName())
                .clientType(entity.getClientType())
                .clientTypeDescription(entity.getClientType() != null ? entity.getClientType().getDescription() : null)
                .address(entity.getAddress())
                .representativeName(entity.getRepresentativeName())
                .representativeTitle(entity.getRepresentativeTitle())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .contractNumber(entity.getContractNumber())
                .dailyServings(entity.getDailyServings())
                .pricePerServing(entity.getPricePerServing())
                .contractStartDate(entity.getContractStartDate())
                .contractEndDate(entity.getContractEndDate())
                .contractPdfUrl(entity.getContractPdfUrl())
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
