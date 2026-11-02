package com.example.demomealcheck.dto.response;

import com.example.demomealcheck.domain.entity.SupplierClient;
import com.example.demomealcheck.domain.enums.ClientStatus;
import com.example.demomealcheck.domain.enums.ClientType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupplierClientSummaryResponse {

    private Long id;
    private String name;
    private ClientType clientType;
    private String clientTypeDescription;
    private String representativeName;
    private String contractNumber;
    private LocalDate contractEndDate;
    private ClientStatus status;
    private String statusDescription;
    private boolean isExpiringSoon;
    private Long daysUntilExpiration;

    public static SupplierClientSummaryResponse fromEntity(SupplierClient entity) {
        if (entity == null) return null;

        boolean expiringSoon = false;
        Long daysLeft = null;

        if (entity.getContractEndDate() != null) {
            LocalDate today = LocalDate.now();
            daysLeft = ChronoUnit.DAYS.between(today, entity.getContractEndDate());
            // Expiring soon if within 30 days and not yet expired/paused
            if (daysLeft >= 0 && daysLeft <= 30 && entity.getStatus() == ClientStatus.ACTIVE) {
                expiringSoon = true;
            }
        }

        return SupplierClientSummaryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .clientType(entity.getClientType())
                .clientTypeDescription(entity.getClientType() != null ? entity.getClientType().getDescription() : null)
                .representativeName(entity.getRepresentativeName())
                .contractNumber(entity.getContractNumber())
                .contractEndDate(entity.getContractEndDate())
                .status(entity.getStatus())
                .statusDescription(entity.getStatus() != null ? entity.getStatus().getDescription() : null)
                .isExpiringSoon(expiringSoon)
                .daysUntilExpiration(daysLeft)
                .build();
    }
}
