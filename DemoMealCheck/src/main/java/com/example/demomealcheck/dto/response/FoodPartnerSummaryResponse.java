package com.example.demomealcheck.dto.response;

import com.example.demomealcheck.domain.entity.FoodPartner;
import com.example.demomealcheck.domain.enums.PartnerCategory;
import com.example.demomealcheck.domain.enums.PartnerStatus;
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
public class FoodPartnerSummaryResponse {

    private Long id;
    private String name;
    private PartnerCategory category;
    private String categoryDescription;
    private String representative;
    private String contractNumber;
    private LocalDate contractEndDate;
    private PartnerStatus status;
    private String statusDescription;
    private boolean isExpiringSoon;
    private Long daysUntilExpiration;

    public static FoodPartnerSummaryResponse fromEntity(FoodPartner entity) {
        if (entity == null) return null;

        boolean expiringSoon = false;
        Long daysLeft = null;

        if (entity.getContractEndDate() != null) {
            LocalDate today = LocalDate.now();
            daysLeft = ChronoUnit.DAYS.between(today, entity.getContractEndDate());
            // Expiring soon if within 30 days and not yet terminated
            if (daysLeft >= 0 && daysLeft <= 30 && entity.getStatus() == PartnerStatus.ACTIVE) {
                expiringSoon = true;
            }
        }

        return FoodPartnerSummaryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .category(entity.getCategory())
                .categoryDescription(entity.getCategory() != null ? entity.getCategory().getDescription() : null)
                .representative(entity.getRepresentative())
                .contractNumber(entity.getContractNumber())
                .contractEndDate(entity.getContractEndDate())
                .status(entity.getStatus())
                .statusDescription(entity.getStatus() != null ? entity.getStatus().getDescription() : null)
                .isExpiringSoon(expiringSoon)
                .daysUntilExpiration(daysLeft)
                .build();
    }
}
