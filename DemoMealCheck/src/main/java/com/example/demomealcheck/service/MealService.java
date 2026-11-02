package com.example.demomealcheck.service;

import com.example.demomealcheck.domain.enums.DishType;
import com.example.demomealcheck.domain.entity.Meal;
import com.example.demomealcheck.domain.entity.User;
import com.example.demomealcheck.dto.response.DailyNutritionSummary;
import com.example.demomealcheck.dto.request.MealRequest;
import com.example.demomealcheck.dto.response.MealResponse;
import com.example.demomealcheck.repository.MealRepository;
import com.example.demomealcheck.repository.UserRepository;
import com.example.demomealcheck.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MealService {

    private final MealRepository mealRepository;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + principal.getId()));
    }

    @Transactional
    public MealResponse createMeal(UserPrincipal principal, MealRequest request) {
        User user = getUser(principal);

        Meal meal = Meal.builder()
                .user(user)
                .title(request.getTitle().trim())
                .dishType(request.getDishType())
                .customDishType(request.getCustomDishType() != null ? request.getCustomDishType().trim() : null)
                .amount(request.getAmount())
                .unit(request.getUnit() != null ? request.getUnit().trim() : request.getDishType().getDefaultUnit())
                .mealTime(request.getMealTime() != null ? request.getMealTime() : Instant.now())
                .notes(request.getNotes())
                .build();

        Meal savedMeal = mealRepository.save(meal);
        return MealResponse.fromEntity(savedMeal);
    }

    @Transactional
    public List<MealResponse> createMealsBatch(UserPrincipal principal, List<MealRequest> requests) {
        User user = getUser(principal);
        Instant now = Instant.now();

        List<Meal> meals = requests.stream().map(req -> Meal.builder()
                .user(user)
                .title(req.getTitle().trim())
                .dishType(req.getDishType())
                .customDishType(req.getCustomDishType() != null ? req.getCustomDishType().trim() : null)
                .amount(req.getAmount())
                .unit(req.getUnit() != null ? req.getUnit().trim() : req.getDishType().getDefaultUnit())
                .mealTime(req.getMealTime() != null ? req.getMealTime() : now)
                .notes(req.getNotes())
                .build()
        ).toList();

        List<Meal> savedMeals = mealRepository.saveAll(meals);
        return savedMeals.stream().map(MealResponse::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public List<MealResponse> getUserMeals(UserPrincipal principal) {
        User user = getUser(principal);
        return mealRepository.findByUserOrderByMealTimeDesc(user)
                .stream()
                .map(MealResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public MealResponse getMealById(UserPrincipal principal, Long id) {
        User user = getUser(principal);
        Meal meal = mealRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Meal not found with id: " + id));
        return MealResponse.fromEntity(meal);
    }

    @Transactional
    public MealResponse updateMeal(UserPrincipal principal, Long id, MealRequest request) {
        User user = getUser(principal);
        Meal meal = mealRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy món ăn với id: " + id));

        // Kiểm tra điều kiện chỉnh sửa trong vòng 30 phút kể từ lúc tạo
        if (meal.getCreatedAt() != null) {
            Instant limitTime = meal.getCreatedAt().plus(30, java.time.temporal.ChronoUnit.MINUTES);
            if (Instant.now().isAfter(limitTime)) {
                throw new IllegalStateException("Đã quá 30 phút kể từ khi tạo món ăn (" + meal.getTitle() + "), không thể chỉnh sửa thông tin!");
            }
        }

        meal.setTitle(request.getTitle().trim());
        meal.setDishType(request.getDishType());
        meal.setCustomDishType(request.getCustomDishType() != null ? request.getCustomDishType().trim() : null);
        meal.setAmount(request.getAmount());
        meal.setUnit(request.getUnit() != null ? request.getUnit().trim() : request.getDishType().getDefaultUnit());
        if (request.getMealTime() != null) {
            meal.setMealTime(request.getMealTime());
        }
        meal.setNotes(request.getNotes());

        Meal updatedMeal = mealRepository.save(meal);
        return MealResponse.fromEntity(updatedMeal);
    }

    @Transactional
    public void deleteMeal(UserPrincipal principal, Long id) {
        User user = getUser(principal);
        Meal meal = mealRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Meal not found with id: " + id));
        mealRepository.delete(meal);
    }

    @Transactional(readOnly = true)
    public DailyNutritionSummary getDailySummary(UserPrincipal principal, LocalDate date) {
        User user = getUser(principal);
        LocalDate targetDate = (date != null) ? date : LocalDate.now(ZoneId.systemDefault());

        ZoneId zoneId = ZoneId.systemDefault();
        Instant start = targetDate.atStartOfDay(zoneId).toInstant();
        Instant end = targetDate.plusDays(1).atStartOfDay(zoneId).toInstant();

        List<Meal> meals = mealRepository.findByUserAndMealTimeBetweenOrderByMealTimeAsc(user, start, end);

        double totalGrams = 0.0;
        double totalMilliliters = 0.0;
        Map<String, Long> countByType = new HashMap<>();

        for (Meal m : meals) {
            if ("ml".equalsIgnoreCase(m.getUnit())) {
                totalMilliliters += m.getAmount();
            } else {
                totalGrams += m.getAmount();
            }

            String typeKey = (m.getDishType() == DishType.KHAC && m.getCustomDishType() != null && !m.getCustomDishType().isBlank())
                    ? m.getCustomDishType()
                    : (m.getDishType() != null ? m.getDishType().getDisplayName() : "Khác");
            countByType.put(typeKey, countByType.getOrDefault(typeKey, 0L) + 1L);
        }

        List<MealResponse> mealResponses = meals.stream()
                .map(MealResponse::fromEntity)
                .toList();

        return DailyNutritionSummary.builder()
                .date(targetDate)
                .mealCount(meals.size())
                .totalGrams(Math.round(totalGrams * 10.0) / 10.0)
                .totalMilliliters(Math.round(totalMilliliters * 10.0) / 10.0)
                .countByType(countByType)
                .meals(mealResponses)
                .build();
    }
}
