package com.example.demomealcheck.domain.entity;

import com.example.demomealcheck.domain.enums.DishType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "meals", indexes = {
        @Index(name = "idx_meals_user_time", columnList = "user_id, meal_time")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "dish_type", nullable = false, length = 50)
    private DishType dishType;

    @Column(name = "custom_dish_type", length = 100)
    private String customDishType;

    @Column(nullable = false)
    @Builder.Default
    private double amount = 0.0;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String unit = "g";

    @Column(name = "meal_time", nullable = false)
    private Instant mealTime;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
