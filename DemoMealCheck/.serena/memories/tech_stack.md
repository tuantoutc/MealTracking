# Tech Stack

- **Backend**: Java 21, Spring Boot 3.4.5 (Directory: `D:\antigravity\software\DemoMealCheck`).
- **Build Tool**: Apache Maven (`mvn`).
- **Database**: PostgreSQL 16+ (`localhost:5432/meal_tracking`).
- **Database Migrations**: Liquibase with 100% Formatted SQL (`--liquibase formatted sql`) located in `src/main/resources/db/changelog/changes/*.sql` via `db.changelog-master.xml`.
- **Security**: Spring Security 6, Stateless JWT (Access token 5 days, Refresh token 7 days), Token Rotation, OAuth2 Google Client.
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4 (Directory: `D:\antigravity\software\Meal_Tracking_Fe`).
- **Icons & UI**: Lucide React.
