package com.example.demomealcheck.dto.response;

import com.example.demomealcheck.domain.enums.DishType;
import com.example.demomealcheck.domain.entity.Meal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealResponse {
    private Long id;
    private String title;
    private DishType dishType;
    private String customDishType;
    private String dishTypeDisplay;
    private double amount;
    private String unit;
    private Instant mealTime;
    private String notes;
    private Instant createdAt;

    public static MealResponse fromEntity(Meal meal) {
        String display = (meal.getDishType() == DishType.KHAC && meal.getCustomDishType() != null && !meal.getCustomDishType().isBlank())
                ? meal.getCustomDishType()
                : (meal.getDishType() != null ? meal.getDishType().getDisplayName() : "");

        return MealResponse.builder()
                .id(meal.getId())
                .title(meal.getTitle())
                .dishType(meal.getDishType())
                .customDishType(meal.getCustomDishType())
                .dishTypeDisplay(display)
                .amount(meal.getAmount())
                .unit(meal.getUnit())
                .mealTime(meal.getMealTime())
                .notes(meal.getNotes())
                .createdAt(meal.getCreatedAt())
                .build();
    }
}
