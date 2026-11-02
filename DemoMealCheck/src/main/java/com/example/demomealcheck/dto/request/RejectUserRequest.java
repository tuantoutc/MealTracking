package com.example.demomealcheck.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectUserRequest {
    @NotBlank(message = "Vui lòng nhập lý do từ chối")
    private String reason;
}
