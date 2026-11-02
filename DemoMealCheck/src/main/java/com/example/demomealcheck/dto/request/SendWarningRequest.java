package com.example.demomealcheck.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendWarningRequest {
    @NotBlank(message = "Tiêu đề cảnh báo không được để trống")
    private String title;

    @NotBlank(message = "Nội dung cảnh báo không được để trống")
    private String content;
}
