package com.example.demomealcheck.service.impl;

import com.example.demomealcheck.domain.entity.AccountWarning;
import com.example.demomealcheck.domain.enums.ApprovalStatus;
import com.example.demomealcheck.domain.entity.Role;
import com.example.demomealcheck.domain.entity.User;
import com.example.demomealcheck.dto.request.SendWarningRequest;
import com.example.demomealcheck.dto.response.AccountWarningDto;
import com.example.demomealcheck.dto.response.AdminStatsDto;
import com.example.demomealcheck.dto.response.UserSummaryDto;
import com.example.demomealcheck.repository.AccountWarningRepository;
import com.example.demomealcheck.repository.RoleRepository;
import com.example.demomealcheck.repository.UserRepository;
import com.example.demomealcheck.service.AdminService;
import com.example.demomealcheck.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AccountWarningRepository accountWarningRepository;
    private final EmailService emailService;

    @Override
    @Transactional(readOnly = true)
    public AdminStatsDto getAdminStats() {
        long totalUsers = userRepository.count();
        long pendingApprovals = userRepository.countByApprovalStatus(ApprovalStatus.PENDING);
        long approvedUsers = userRepository.countByApprovalStatus(ApprovalStatus.APPROVED);
        long rejectedUsers = userRepository.countByApprovalStatus(ApprovalStatus.REJECTED);
        long lockedUsers = userRepository.countByLocked(true);
        long verifiedBadgeCount = userRepository.countByVerifiedBadge(true);
        long pendingBadgeRequests = userRepository.countByBadgeRequested(true);

        Map<String, Long> roleDistribution = new LinkedHashMap<>();
        List<Role> allRoles = roleRepository.findAll();
        for (Role role : allRoles) {
            long count = userRepository.findAll().stream()
                    .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName().equals(role.getName())))
                    .count();
            roleDistribution.put(role.getName(), count);
        }

        return AdminStatsDto.builder()
                .totalUsers(totalUsers)
                .pendingApprovals(pendingApprovals)
                .approvedUsers(approvedUsers)
                .rejectedUsers(rejectedUsers)
                .lockedUsers(lockedUsers)
                .verifiedBadgeCount(verifiedBadgeCount)
                .pendingBadgeRequests(pendingBadgeRequests)
                .roleDistribution(roleDistribution)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryDto> searchUsers(String keyword, ApprovalStatus approvalStatus, Boolean locked,
                                            Boolean verifiedBadge, String roleName, Pageable pageable) {
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("fullName")), pattern);
                Predicate emailLike = cb.like(cb.lower(root.get("email")), pattern);
                Predicate phoneLike = cb.like(root.get("phoneNumber"), "%" + keyword.trim() + "%");
                predicates.add(cb.or(nameLike, emailLike, phoneLike));
            }

            if (approvalStatus != null) {
                predicates.add(cb.equal(root.get("approvalStatus"), approvalStatus));
            }

            if (locked != null) {
                predicates.add(cb.equal(root.get("locked"), locked));
            }

            if (verifiedBadge != null) {
                predicates.add(cb.equal(root.get("verifiedBadge"), verifiedBadge));
            }

            if (roleName != null && !roleName.trim().isEmpty()) {
                Join<User, Role> roleJoin = root.join("roles", JoinType.INNER);
                predicates.add(cb.equal(roleJoin.get("name"), roleName.trim()));
                if (query != null) {
                    query.distinct(true);
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<User> users = userRepository.findAll(spec, pageable);
        return users.map(UserSummaryDto::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public UserSummaryDto getUserDetail(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với id: " + id));
        return UserSummaryDto.fromEntity(user);
    }

    @Override
    @Transactional
    public UserSummaryDto approveUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với id: " + id));

        user.setApprovalStatus(ApprovalStatus.APPROVED);
        user.setRejectionReason(null);

        // Gán vai trò đã yêu cầu nếu chưa có trong tập roles
        if (user.getRequestedRole() != null && !user.getRequestedRole().isBlank()) {
            Role role = roleRepository.findByName(user.getRequestedRole())
                    .orElseGet(() -> roleRepository.save(Role.builder().name(user.getRequestedRole()).build()));
            user.getRoles().add(role);
        }

        User updatedUser = userRepository.save(user);
        log.info("Admin đã phê duyệt tài khoản: {} với vai trò {}", updatedUser.getEmail(), updatedUser.getRequestedRole());

        // Gửi email thông báo
        emailService.sendAccountApprovalNotification(updatedUser.getEmail(), updatedUser.getFullName(),
                updatedUser.getRequestedRole() != null ? updatedUser.getRequestedRole() : "Người dùng");

        return UserSummaryDto.fromEntity(updatedUser);
    }

    @Override
    @Transactional
    public UserSummaryDto rejectUser(Long id, String reason) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với id: " + id));

        user.setApprovalStatus(ApprovalStatus.REJECTED);
        user.setRejectionReason(reason != null ? reason.trim() : "Hồ sơ không đáp ứng tiêu chí kiểm chuẩn");

        User updatedUser = userRepository.save(user);
        log.info("Admin đã từ chối tài khoản: {} với lý do: {}", updatedUser.getEmail(), reason);

        // Gửi email thông báo từ chối
        emailService.sendAccountRejectionNotification(updatedUser.getEmail(), updatedUser.getFullName(), user.getRejectionReason());

        return UserSummaryDto.fromEntity(updatedUser);
    }

    @Override
    @Transactional
    public UserSummaryDto lockUser(Long id, Long adminId, String reason) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với id: " + id));

        // Kiểm tra tránh admin tự khóa chính mình
        if (adminId != null && adminId.equals(user.getId())) {
            throw new IllegalArgumentException("Quản trị viên không thể tự khóa tài khoản của chính mình");
        }

        user.setLocked(true);
        if (reason != null && !reason.isBlank()) {
            user.setWarningMessage(reason.trim());
            user.setWarningCount(user.getWarningCount() + 1);

            User admin = adminId != null ? userRepository.findById(adminId).orElse(null) : null;
            AccountWarning warning = AccountWarning.builder()
                    .user(user)
                    .admin(admin)
                    .warningTitle("Khóa tài khoản")
                    .warningContent(reason.trim())
                    .build();
            accountWarningRepository.save(warning);
        }

        User updatedUser = userRepository.save(user);

        // Gửi thông báo email
        emailService.sendAccountLockNotification(user.getEmail(), user.getFullName(),
                "Khóa tài khoản", reason);
        log.warn("Admin đã KHÓA tài khoản {}. Lý do: {}", updatedUser.getEmail(), reason);

        return UserSummaryDto.fromEntity(updatedUser);
    }

    @Override
    @Transactional
    public UserSummaryDto unlockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với id: " + id));

        user.setLocked(false);
        User updatedUser = userRepository.save(user);
        log.info("Admin đã MỞ KHÓA tài khoản {}", updatedUser.getEmail());
        return UserSummaryDto.fromEntity(updatedUser);
    }

    @Override
    @Transactional
    public AccountWarningDto sendWarning(Long id, Long adminId, SendWarningRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với id: " + id));

        User admin = adminId != null ? userRepository.findById(adminId).orElse(null) : null;

        user.setWarningMessage(request.getTitle().trim() + ": " + request.getContent().trim());
        user.setWarningCount(user.getWarningCount() + 1);
        userRepository.save(user);

        AccountWarning warning = AccountWarning.builder()
                .user(user)
                .admin(admin)
                .warningTitle(request.getTitle().trim())
                .warningContent(request.getContent().trim())
                .build();
        AccountWarning savedWarning = accountWarningRepository.save(warning);

        // Gửi thông báo email
        emailService.sendAccountWarningNotification(user.getEmail(), user.getFullName(),
                request.getTitle().trim(), request.getContent().trim());

        log.warn("Đã gửi cảnh báo tới user {}: {}", user.getEmail(), request.getTitle());
        return AccountWarningDto.fromEntity(savedWarning);
    }

    @Override
    @Transactional
    public UserSummaryDto approveBadge(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với id: " + id));

        user.setVerifiedBadge(true);
        user.setBadgeRequested(false);
        user.setBadgeRequestReason(null);

        User updatedUser = userRepository.save(user);
        log.info("Admin đã CẤP TÍCH XANH cho tài khoản: {}", updatedUser.getEmail());
        return UserSummaryDto.fromEntity(updatedUser);
    }

    @Override
    @Transactional
    public UserSummaryDto revokeBadge(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với id: " + id));

        user.setVerifiedBadge(false);
        user.setBadgeRequested(false);
        user.setBadgeRequestReason(null);

        User updatedUser = userRepository.save(user);
        log.info("Admin đã THU HỒI TÍCH XANH của tài khoản: {}", updatedUser.getEmail());
        return UserSummaryDto.fromEntity(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountWarningDto> getUserWarnings(Long userId) {
        return accountWarningRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(AccountWarningDto::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountWarningDto> getAllWarnings() {
        return accountWarningRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(AccountWarningDto::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSummaryDto> getPendingApprovals() {
        return userRepository.findByApprovalStatusOrderByCreatedAtDesc(ApprovalStatus.PENDING)
                .stream().map(UserSummaryDto::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSummaryDto> getPendingBadgeRequests() {
        return userRepository.findByBadgeRequestedTrueOrderByCreatedAtDesc()
                .stream().map(UserSummaryDto::fromEntity).toList();
    }
}
