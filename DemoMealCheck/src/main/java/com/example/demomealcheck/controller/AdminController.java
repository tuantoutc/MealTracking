package com.example.demomealcheck.controller;

import com.example.demomealcheck.domain.enums.ApprovalStatus;
import com.example.demomealcheck.dto.request.RejectUserRequest;
import com.example.demomealcheck.dto.request.SendWarningRequest;
import com.example.demomealcheck.dto.response.AccountWarningDto;
import com.example.demomealcheck.dto.response.AdminStatsDto;
import com.example.demomealcheck.dto.ApiResponse;
import com.example.demomealcheck.dto.response.UserSummaryDto;
import com.example.demomealcheck.security.UserPrincipal;
import com.example.demomealcheck.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        AdminStatsDto stats = adminService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.success("Lấy thống kê admin thành công", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserSummaryDto>>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ApprovalStatus status,
            @RequestParam(required = false) Boolean locked,
            @RequestParam(required = false) Boolean verifiedBadge,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<UserSummaryDto> users = adminService.searchUsers(search, status, locked, verifiedBadge, role, pageRequest);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserSummaryDto>> getUserDetail(@PathVariable Long id) {
        UserSummaryDto user = adminService.getUserDetail(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping("/users/{id}/approve")
    public ResponseEntity<ApiResponse<UserSummaryDto>> approveUser(@PathVariable Long id) {
        UserSummaryDto user = adminService.approveUser(id);
        return ResponseEntity.ok(ApiResponse.success("Phê duyệt tài khoản thành công", user));
    }

    @PostMapping("/users/{id}/reject")
    public ResponseEntity<ApiResponse<UserSummaryDto>> rejectUser(
            @PathVariable Long id,
            @RequestBody(required = false) RejectUserRequest request
    ) {
        String reason = (request != null && request.getReason() != null) ? request.getReason() : "Hồ sơ không đáp ứng điều kiện";
        UserSummaryDto user = adminService.rejectUser(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Đã từ chối tài khoản thành công", user));
    }

    @PostMapping("/users/{id}/lock")
    public ResponseEntity<ApiResponse<UserSummaryDto>> lockUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal adminPrincipal,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String reason = (body != null) ? body.get("reason") : "Vi phạm quy định sử dụng hệ thống";
        Long adminId = adminPrincipal != null ? adminPrincipal.getId() : null;
        UserSummaryDto user = adminService.lockUser(id, adminId, reason);
        return ResponseEntity.ok(ApiResponse.success("Đã khóa tài khoản thành công", user));
    }

    @PostMapping("/users/{id}/unlock")
    public ResponseEntity<ApiResponse<UserSummaryDto>> unlockUser(@PathVariable Long id) {
        UserSummaryDto user = adminService.unlockUser(id);
        return ResponseEntity.ok(ApiResponse.success("Đã mở khóa tài khoản thành công", user));
    }

    @PostMapping("/users/{id}/warn")
    public ResponseEntity<ApiResponse<AccountWarningDto>> sendWarning(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal adminPrincipal,
            @Valid @RequestBody SendWarningRequest request
    ) {
        Long adminId = adminPrincipal != null ? adminPrincipal.getId() : null;
        AccountWarningDto warning = adminService.sendWarning(id, adminId, request);
        return ResponseEntity.ok(ApiResponse.success("Đã gửi cảnh báo tới tài khoản thành công", warning));
    }

    @PostMapping("/users/{id}/approve-badge")
    public ResponseEntity<ApiResponse<UserSummaryDto>> approveBadge(@PathVariable Long id) {
        UserSummaryDto user = adminService.approveBadge(id);
        return ResponseEntity.ok(ApiResponse.success("Đã phê duyệt tích xanh thành công", user));
    }

    @PostMapping("/users/{id}/revoke-badge")
    public ResponseEntity<ApiResponse<UserSummaryDto>> revokeBadge(@PathVariable Long id) {
        UserSummaryDto user = adminService.revokeBadge(id);
        return ResponseEntity.ok(ApiResponse.success("Đã thu hồi tích xanh thành công", user));
    }

    @GetMapping("/users/{id}/warnings")
    public ResponseEntity<ApiResponse<List<AccountWarningDto>>> getUserWarnings(@PathVariable Long id) {
        List<AccountWarningDto> warnings = adminService.getUserWarnings(id);
        return ResponseEntity.ok(ApiResponse.success(warnings));
    }

    @GetMapping("/warnings")
    public ResponseEntity<ApiResponse<List<AccountWarningDto>>> getAllWarnings() {
        List<AccountWarningDto> warnings = adminService.getAllWarnings();
        return ResponseEntity.ok(ApiResponse.success(warnings));
    }

    @GetMapping("/pending-approvals")
    public ResponseEntity<ApiResponse<List<UserSummaryDto>>> getPendingApprovals() {
        List<UserSummaryDto> list = adminService.getPendingApprovals();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/pending-badges")
    public ResponseEntity<ApiResponse<List<UserSummaryDto>>> getPendingBadges() {
        List<UserSummaryDto> list = adminService.getPendingBadgeRequests();
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
