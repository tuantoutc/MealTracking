# Conventions & Invariants

## Backend (Spring Boot 3.4.5)
- **Domain Modeling**: Lombok `@Getter`, `@Setter`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`. Use `Instant` for timestamps.
- **Portion Units**: `g` (Grams) for solid dishes (Cơm, Món kho, Xào, Rán, Tráng miệng) and `ml` (Milliliters) for liquid dishes (Canh, Cháo, Bún, Miến, Phở).
- **Edit Window Invariant**: Meals may only be modified within 30 minutes of `createdAt`. `MealService.updateMeal` enforces this with `IllegalStateException`, handled by `GlobalExceptionHandler` returning HTTP 400.
- **Liquibase Rules**: Strictly use Formatted SQL (`--liquibase formatted sql`). Keep scripts idempotent (`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`).
- **REST Envelope**: All endpoints return `ApiResponse<T>` with `success`, `message`, `data`.

## Frontend (Next.js 16)
- **State Management & Context**: `AuthContext.tsx` handles JWT storage and user session.
- **API Interceptor**: `apiClient` in `src/lib/api.ts` automatically rotates refresh token on HTTP 401.
- **Modals**: Detail, Edit (with 30-min countdown timer), and Delete Confirmation dialogs before destructive actions.
