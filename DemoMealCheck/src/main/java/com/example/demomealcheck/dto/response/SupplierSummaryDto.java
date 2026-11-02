package com.example.demomealcheck.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupplierSummaryDto {
    private long totalPartners;
    private long activePartners;
    private long totalClients;
    private long activeClients;
    private long totalDailyServings;
}
