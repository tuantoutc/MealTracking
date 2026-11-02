package com.example.demomealcheck.dto.response;

import com.example.demomealcheck.domain.entity.AccountWarning;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountWarningDto {
    private Long id;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private String adminFullName;
    private String warningTitle;
    private String warningContent;
    private Instant createdAt;

    public static AccountWarningDto fromEntity(AccountWarning warning) {
        if (warning == null) {
            return null;
        }
        return AccountWarningDto.builder()
                .id(warning.getId())
                .userId(warning.getUser().getId())
                .userFullName(warning.getUser().getFullName())
                .userEmail(warning.getUser().getEmail())
                .adminFullName(warning.getAdmin() != null ? warning.getAdmin().getFullName() : "Hệ Thống")
                .warningTitle(warning.getWarningTitle())
                .warningContent(warning.getWarningContent())
                .createdAt(warning.getCreatedAt())
                .build();
    }
}
