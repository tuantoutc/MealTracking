package com.example.demomealcheck.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BadgeRequestDto {
    @NotBlank(message = "Vui lòng nhập lý do đề xuất cấp tích xanh")
    private String reason;
}
