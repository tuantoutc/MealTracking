package com.example.demomealcheck.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDto {
    private long totalUsers;
    private long pendingApprovals;
    private long approvedUsers;
    private long rejectedUsers;
    private long lockedUsers;
    private long verifiedBadgeCount;
    private long pendingBadgeRequests;
    private Map<String, Long> roleDistribution;
}
