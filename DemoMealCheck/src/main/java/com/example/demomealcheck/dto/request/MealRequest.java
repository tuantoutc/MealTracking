package com.example.demomealcheck.dto.request;

import com.example.demomealcheck.domain.enums.DishType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.Instant;

@Data
public class MealRequest {

    @NotBlank(message = "Tên món ăn không được để trống")
    private String title;

    @NotNull(message = "Loại món ăn là bắt buộc")
    private DishType dishType;

    private String customDishType;

    @Positive(message = "Định lượng phải lớn hơn 0")
    private double amount;

    @NotBlank(message = "Đơn vị (g hoặc ml) là bắt buộc")
    private String unit;

    private Instant mealTime;

    private String notes;
}
