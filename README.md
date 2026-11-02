# MealTracking (MealTrace / SmartMeal)

MealTracking is a school meal transparency platform with:
- **Backend**: Spring Boot (Java 21), PostgreSQL, Liquibase, JWT/OAuth2 security.
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS.
- **Product docs**: End-to-end meal monitoring workflow and feature plans in `/docs`.

The goal is to help schools, suppliers, admins, and parents track meal quality, delivery, and accountability.

## Repository Structure

```text
MealTracking/
├── DemoMealCheck/        # Spring Boot backend API
├── Meal_Tracking_Fe/     # Next.js frontend
└── docs/                 # Product docs, phase plan, feature specs, schema
```

## Current Implementation Status

Based on code and docs:

- ✅ **FEAT-00**: Account governance (register, email verification, admin approval, warnings, lock/unlock, verified badge).
- ✅ **FEAT-01-PARTNERS**: Supplier partner/client management (CRUD + dashboard summary).
- ✅ **Personal meal tracking core**: Meal CRUD, batch meal creation, and daily nutrition summary.
- 🚧 **FEAT-01 ~ FEAT-05 state-machine flow** (supplier batch, gate handover, portion benchmark, classroom serving, parent realtime feed): database schema is present, but end-to-end APIs/UI flows are not fully implemented yet.

See:
- `/docs/MASTER_PLAN.md`
- `/docs/PHASE_1_CORE.md`
- `/docs/features/`

## Main Roles in the System

The project defines role-based access for:
- `ROLE_ADMIN`
- `ROLE_SUPPLIER`
- `ROLE_GATE_INSPECTOR`
- `ROLE_NUTRITIONIST`
- `ROLE_TEACHER`
- `ROLE_WARD_OFFICER`
- `ROLE_PRINCIPAL`
- `ROLE_PARENT`

Frontend has dedicated pages for each role. Admin and Supplier are connected to backend APIs; several other role dashboards are currently mostly informational UI screens.

## Backend Overview (`/DemoMealCheck`)

### Tech Stack
- Spring Boot 3.4.5
- Spring Security (JWT + OAuth2 login)
- Spring Data JPA
- Liquibase migrations
- PostgreSQL

### Key API Areas
- `/api/v1/auth/*`: register, verify email, login, refresh token, logout, profile.
- `/api/v1/admin/*`: user approval/rejection, lock/unlock, warnings, badge approval, stats.
- `/api/v1/supplier/*`: supplier summary, food partners CRUD, clients CRUD.
- `/api/v1/meals/*`: meal CRUD, batch create, daily summary.

### Run Backend
1. Create PostgreSQL database (for example: `meal_tracking`).
2. Update backend configuration in:
   - `DemoMealCheck/src/main/resources/application.yml`
3. From `DemoMealCheck/` run:

```bash
./mvnw spring-boot:run
```

Backend default URL: `http://localhost:8080`

## Frontend Overview (`/Meal_Tracking_Fe`)

### Tech Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### Run Frontend
From `Meal_Tracking_Fe/`:

```bash
npm install
npm run dev
```

Frontend default URL: `http://localhost:3000`

Set API URL if needed:
- `NEXT_PUBLIC_API_URL=http://localhost:8080`

## Documentation Guide

- Start at `/docs/MASTER_PLAN.md` for business/system overview.
- Check `/docs/PHASE_1_CORE.md` for feature progress tracking.
- Read each feature spec in `/docs/features/` for detailed business rules.
- Use `/docs/schema.sql` for Phase 1 data model reference.

## Notes for New Contributors

- This repository contains both **product vision docs** and **partial implementation**.
- When adding features, align API, UI, and docs together.
- Prefer updating feature status in docs after completing each feature.
