package com.example.demomealcheck.service;

import com.example.demomealcheck.config.JwtProperties;
import com.example.demomealcheck.domain.enums.ApprovalStatus;
import com.example.demomealcheck.domain.enums.AuthProvider;
import com.example.demomealcheck.domain.entity.RefreshToken;
import com.example.demomealcheck.domain.entity.Role;
import com.example.demomealcheck.domain.entity.User;
import com.example.demomealcheck.dto.request.LoginRequest;
import com.example.demomealcheck.dto.request.RegisterRequest;
import com.example.demomealcheck.dto.request.TokenRefreshRequest;
import com.example.demomealcheck.dto.response.AuthResponse;
import com.example.demomealcheck.dto.response.UserSummaryDto;
import com.example.demomealcheck.repository.RoleRepository;
import com.example.demomealcheck.repository.UserRepository;
import com.example.demomealcheck.security.JwtTokenProvider;
import com.example.demomealcheck.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final JwtProperties jwtProperties;
    private final EmailService emailService;

    @Transactional
    public UserSummaryDto register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email đã tồn tại trong hệ thống: " + email);
        }

        // Chuẩn hóa tên vai trò
        String rawRole = request.getRole() != null ? request.getRole().trim().toUpperCase() : "ROLE_USER";
        String normalizedRoleName = rawRole.startsWith("ROLE_") ? rawRole : "ROLE_" + rawRole;

        // Đảm bảo vai trò hợp lệ
        Set<String> validRoles = Set.of(
                "ROLE_ADMIN", "ROLE_SUPPLIER", "ROLE_TEACHER",
                "ROLE_GATE_INSPECTOR", "ROLE_WARD_OFFICER", "ROLE_PRINCIPAL", "ROLE_PARENT", "ROLE_USER"
        );
        if (!validRoles.contains(normalizedRoleName)) {
            normalizedRoleName = "ROLE_USER";
        }

        final String targetRoleName = normalizedRoleName;
        Role userRole = roleRepository.findByName(targetRoleName)
                .orElseGet(() -> roleRepository.save(Role.builder().name(targetRoleName).build()));

        // Sinh token xác thực email 24 giờ
        String verificationToken = UUID.randomUUID().toString();
        Instant tokenExpiry = Instant.now().plus(24, ChronoUnit.HOURS);

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .phoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null)
                .organization(request.getOrganization() != null ? request.getOrganization().trim() : null)
                .address(request.getAddress() != null ? request.getAddress().trim() : null)
                .provider(AuthProvider.LOCAL)
                .requestedRole(targetRoleName)
                .approvalStatus(ApprovalStatus.PENDING)
                .emailVerified(false)
                .emailVerificationToken(verificationToken)
                .emailVerificationTokenExpiry(tokenExpiry)
                .verifiedBadge(false)
                .badgeRequested(false)
                .locked(false)
                .enabled(true)
                .roles(new HashSet<>(Set.of(userRole)))
                .build();

        User savedUser = userRepository.save(user);

        // Gửi email xác nhận kèm link kích hoạt
        emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getFullName(), verificationToken);

        return UserSummaryDto.fromEntity(savedUser);
    }

    @Transactional
    public UserSummaryDto verifyEmail(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Mã token kích hoạt không được để trống");
        }

        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Link kích hoạt không hợp lệ hoặc đã được sử dụng"));

        if (user.getEmailVerificationTokenExpiry() != null && user.getEmailVerificationTokenExpiry().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Link kích hoạt đã hết hạn (24 giờ). Vui lòng yêu cầu gửi lại link kích hoạt mới.");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiry(null);

        User updatedUser = userRepository.save(user);
        log.info("Xác thực email thành công cho tài khoản: {}", updatedUser.getEmail());
        return UserSummaryDto.fromEntity(updatedUser);
    }

    @Transactional
    public void resendVerification(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email không được để trống");
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản với email: " + email));

        if (user.isEmailVerified()) {
            throw new IllegalStateException("Tài khoản này đã được xác thực email trước đó");
        }

        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        user.setEmailVerificationTokenExpiry(Instant.now().plus(24, ChronoUnit.HOURS));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), verificationToken);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Email hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Email hoặc mật khẩu không chính xác");
        }

        if (user.isLocked()) {
            String msg = "Tài khoản của bạn đã bị KHÓA bởi Quản trị viên.";
            if (user.getWarningMessage() != null && !user.getWarningMessage().isBlank()) {
                msg += " Cảnh báo/Lý do: " + user.getWarningMessage();
            }
            throw new IllegalStateException(msg);
        }

        if (!user.isEmailVerified()) {
            throw new IllegalStateException("Tài khoản chưa kích hoạt email. Vui lòng kiểm tra hòm thư Gmail để nhấn vào link kích hoạt tài khoản.");
        }

        if (user.getApprovalStatus() == ApprovalStatus.PENDING) {
            throw new IllegalStateException("Tài khoản đã đăng ký thành công và đang ở chế độ CHỜ ADMIN PHÊ DUYỆT. Vui lòng liên hệ ban quản trị để được phê duyệt.");
        }

        if (user.getApprovalStatus() == ApprovalStatus.REJECTED) {
            String msg = "Yêu cầu cấp tài khoản của bạn đã bị từ chối.";
            if (user.getRejectionReason() != null && !user.getRejectionReason().isBlank()) {
                msg += " Lý do: " + user.getRejectionReason();
            }
            throw new IllegalStateException(msg);
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String accessToken = tokenProvider.generateAccessToken(principal);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresInMs(jwtProperties.getAccessTokenExpiration())
                .user(UserSummaryDto.fromEntity(user))
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(TokenRefreshRequest request) {
        if (request.getRefreshToken() == null || request.getRefreshToken().isBlank()) {
            throw new IllegalArgumentException("Refresh token is required");
        }

        RefreshToken rotatedToken = refreshTokenService.rotateRefreshToken(request.getRefreshToken());
        User user = rotatedToken.getUser();

        if (user.isLocked()) {
            throw new IllegalStateException("Tài khoản đã bị khóa bởi Quản trị viên");
        }

        UserPrincipal principal = UserPrincipal.create(user);
        String newAccessToken = tokenProvider.generateAccessToken(principal);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(rotatedToken.getToken())
                .tokenType("Bearer")
                .expiresInMs(jwtProperties.getAccessTokenExpiration())
                .user(UserSummaryDto.fromEntity(user))
                .build();
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revokeToken(refreshToken);
        }
    }

    @Transactional(readOnly = true)
    public UserSummaryDto getCurrentUser(UserPrincipal principal) {
        if (principal == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + principal.getId()));
        return UserSummaryDto.fromEntity(user);
    }

    @Transactional
    public UserSummaryDto requestVerifiedBadge(UserPrincipal principal, String reason) {
        if (principal == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.isVerifiedBadge()) {
            throw new IllegalStateException("Tài khoản của bạn đã có tích xanh");
        }

        user.setBadgeRequested(true);
        user.setBadgeRequestReason(reason != null ? reason.trim() : "Đề xuất cấp tích xanh xác thực danh tính");
        User updated = userRepository.save(user);
        log.info("Người dùng {} gửi yêu cầu cấp tích xanh: {}", user.getEmail(), reason);
        return UserSummaryDto.fromEntity(updated);
    }
}
