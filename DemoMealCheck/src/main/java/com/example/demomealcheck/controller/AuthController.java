package com.example.demomealcheck.controller;

import com.example.demomealcheck.dto.request.BadgeRequestDto;
import com.example.demomealcheck.dto.request.LoginRequest;
import com.example.demomealcheck.dto.request.RegisterRequest;
import com.example.demomealcheck.dto.request.TokenRefreshRequest;
import com.example.demomealcheck.dto.ApiResponse;
import com.example.demomealcheck.dto.response.AuthResponse;
import com.example.demomealcheck.dto.response.UserSummaryDto;
import com.example.demomealcheck.security.UserPrincipal;
import com.example.demomealcheck.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserSummaryDto>> register(@Valid @RequestBody RegisterRequest request) {
        UserSummaryDto response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success(
                "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản trước khi chờ Quản trị viên duyệt.",
                response
        ));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<UserSummaryDto>> verifyEmail(@RequestParam("token") String token) {
        UserSummaryDto response = authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success(
                "Xác thực email thành công! Tài khoản của bạn đang ở chế độ chờ Admin phê duyệt.",
                response
        ));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerification(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        authService.resendVerification(email);
        return ResponseEntity.ok(ApiResponse.success(
                "Đã gửi lại link kích hoạt email. Vui lòng kiểm tra hòm thư của bạn.",
                null
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody TokenRefreshRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Làm mới token thành công", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) TokenRefreshRequest request) {
        authService.logout(request != null ? request.getRefreshToken() : null);
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserSummaryDto>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập để xem thông tin"));
        }
        UserSummaryDto user = authService.getCurrentUser(principal);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping("/request-badge")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserSummaryDto>> requestBadge(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody BadgeRequestDto request
    ) {
        UserSummaryDto user = authService.requestVerifiedBadge(principal, request.getReason());
        return ResponseEntity.ok(ApiResponse.success("Đã gửi yêu cầu cấp tích xanh đến Quản trị viên", user));
    }
}
