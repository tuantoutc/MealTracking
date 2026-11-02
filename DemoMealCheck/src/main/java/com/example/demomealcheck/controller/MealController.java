package com.example.demomealcheck.controller;

import com.example.demomealcheck.dto.ApiResponse;
import com.example.demomealcheck.dto.response.DailyNutritionSummary;
import com.example.demomealcheck.dto.request.MealRequest;
import com.example.demomealcheck.dto.response.MealResponse;
import com.example.demomealcheck.security.UserPrincipal;
import com.example.demomealcheck.service.MealService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;

    @PostMapping
    public ResponseEntity<ApiResponse<MealResponse>> createMeal(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody MealRequest request
    ) {
        MealResponse response = mealService.createMeal(principal, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm món ăn thành công", response));
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<MealResponse>>> createMealsBatch(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody List<MealRequest> requests
    ) {
        List<MealResponse> responses = mealService.createMealsBatch(principal, requests);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đã thêm thành công " + responses.size() + " món ăn", responses));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MealResponse>>> getUserMeals(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<MealResponse> meals = mealService.getUserMeals(principal);
        return ResponseEntity.ok(ApiResponse.success(meals));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DailyNutritionSummary>> getDailySummary(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        DailyNutritionSummary summary = mealService.getDailySummary(principal, date);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MealResponse>> getMealById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        MealResponse meal = mealService.getMealById(principal, id);
        return ResponseEntity.ok(ApiResponse.success(meal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MealResponse>> updateMeal(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody MealRequest request
    ) {
        MealResponse response = mealService.updateMeal(principal, id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật bữa ăn thành công", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMeal(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        mealService.deleteMeal(principal, id);
        return ResponseEntity.ok(ApiResponse.success("Xóa bữa ăn thành công", null));
    }
}
