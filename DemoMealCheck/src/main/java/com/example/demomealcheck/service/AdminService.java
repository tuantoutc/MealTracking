package com.example.demomealcheck.service;

import com.example.demomealcheck.domain.enums.ApprovalStatus;
import com.example.demomealcheck.dto.request.SendWarningRequest;
import com.example.demomealcheck.dto.response.AccountWarningDto;
import com.example.demomealcheck.dto.response.AdminStatsDto;
import com.example.demomealcheck.dto.response.UserSummaryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminService {
    AdminStatsDto getAdminStats();
    Page<UserSummaryDto> searchUsers(String keyword, ApprovalStatus approvalStatus, Boolean locked, Boolean verifiedBadge, String roleName, Pageable pageable);
    UserSummaryDto getUserDetail(Long id);
    UserSummaryDto approveUser(Long id);
    UserSummaryDto rejectUser(Long id, String reason);
    UserSummaryDto lockUser(Long id, Long adminId, String reason);
    UserSummaryDto unlockUser(Long id);
    AccountWarningDto sendWarning(Long id, Long adminId, SendWarningRequest request);
    UserSummaryDto approveBadge(Long id);
    UserSummaryDto revokeBadge(Long id);
    List<AccountWarningDto> getUserWarnings(Long userId);
    List<AccountWarningDto> getAllWarnings();
    List<UserSummaryDto> getPendingApprovals();
    List<UserSummaryDto> getPendingBadgeRequests();
}
