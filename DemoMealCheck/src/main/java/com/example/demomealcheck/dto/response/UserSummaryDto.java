package com.example.demomealcheck.dto.response;

import com.example.demomealcheck.domain.enums.ApprovalStatus;
import com.example.demomealcheck.domain.entity.User;
import com.example.demomealcheck.domain.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDto {
    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String organization;
    private String address;
    private String avatarUrl;
    private String provider;
    private String requestedRole;
    private ApprovalStatus approvalStatus;
    private String rejectionReason;
    private boolean emailVerified;
    private boolean verifiedBadge;
    private boolean badgeRequested;
    private String badgeRequestReason;
    private String warningMessage;
    private int warningCount;
    private boolean locked;
    private boolean enabled;
    private List<String> roles;
    private Instant createdAt;

    public static UserSummaryDto fromEntity(User user) {
        if (user == null) {
            return null;
        }
        return UserSummaryDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .organization(user.getOrganization())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
                .provider(user.getProvider() != null ? user.getProvider().name() : null)
                .requestedRole(user.getRequestedRole())
                .approvalStatus(user.getApprovalStatus())
                .rejectionReason(user.getRejectionReason())
                .emailVerified(user.isEmailVerified())
                .verifiedBadge(user.isVerifiedBadge())
                .badgeRequested(user.isBadgeRequested())
                .badgeRequestReason(user.getBadgeRequestReason())
                .warningMessage(user.getWarningMessage())
                .warningCount(user.getWarningCount())
                .locked(user.isLocked())
                .enabled(user.isEnabled())
                .roles(user.getRoles() != null
                        ? user.getRoles().stream().map(Role::getName).toList()
                        : List.of())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
