package com.example.demomealcheck.repository;

import com.example.demomealcheck.domain.enums.DishType;
import com.example.demomealcheck.domain.entity.Meal;
import com.example.demomealcheck.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByUserOrderByMealTimeDesc(User user);

    List<Meal> findByUserAndMealTimeBetweenOrderByMealTimeAsc(User user, Instant start, Instant end);

    List<Meal> findByUserAndDishTypeOrderByMealTimeDesc(User user, DishType dishType);

    Optional<Meal> findByIdAndUser(Long id, User user);

    @Query("SELECT COUNT(m) FROM Meal m WHERE m.user = :user")
    long countByUser(@Param("user") User user);
}
