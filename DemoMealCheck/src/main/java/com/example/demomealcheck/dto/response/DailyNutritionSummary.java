package com.example.demomealcheck.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyNutritionSummary {
    private LocalDate date;
    private int mealCount;
    private double totalGrams;
    private double totalMilliliters;
    private Map<String, Long> countByType;
    private List<MealResponse> meals;
}
