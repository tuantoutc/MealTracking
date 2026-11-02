package com.example.demomealcheck.service;

import com.example.demomealcheck.config.JwtProperties;
import com.example.demomealcheck.domain.entity.RefreshToken;
import com.example.demomealcheck.domain.entity.User;
import com.example.demomealcheck.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", ""))
                .expiryDate(Instant.now().plusMillis(jwtProperties.getRefreshTokenExpiration()))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    /**
     * Strict Refresh Token Rotation:
     * - Validates token existence and expiry.
     * - Anti-reuse detection: if a revoked token is presented, all active tokens for this user are invalidated.
     * - Rotates by revoking old token, setting replacedByToken, and issuing a fresh 7-day token.
     */
    @Transactional
    public RefreshToken rotateRefreshToken(String tokenString) {
        RefreshToken oldToken = refreshTokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token not found"));

        if (oldToken.isRevoked()) {
            log.warn("Refresh token reuse detected for user ID: {}! Invalidating all active tokens.", oldToken.getUser().getId());
            refreshTokenRepository.revokeAllByUser(oldToken.getUser());
            throw new SecurityException("Refresh token reuse detected. All sessions revoked for safety.");
        }

        if (oldToken.isExpired()) {
            oldToken.setRevoked(true);
            refreshTokenRepository.save(oldToken);
            throw new IllegalArgumentException("Refresh token expired. Please login again.");
        }

        RefreshToken newToken = RefreshToken.builder()
                .user(oldToken.getUser())
                .token(UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", ""))
                .expiryDate(Instant.now().plusMillis(jwtProperties.getRefreshTokenExpiration()))
                .revoked(false)
                .build();

        RefreshToken savedNewToken = refreshTokenRepository.save(newToken);

        oldToken.setRevoked(true);
        oldToken.setReplacedByToken(savedNewToken.getToken());
        refreshTokenRepository.save(oldToken);

        return savedNewToken;
    }

    @Transactional
    public void revokeToken(String tokenString) {
        refreshTokenRepository.findByToken(tokenString).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Transactional
    public void revokeAllUserTokens(User user) {
        refreshTokenRepository.revokeAllByUser(user);
    }
}
