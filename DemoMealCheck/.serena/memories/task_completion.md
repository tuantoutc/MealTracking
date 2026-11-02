# Task Completion Checks

Before marking any coding task complete:
1. **Backend Verification**:
   - Run `cd D:\antigravity\software\DemoMealCheck; mvn test-compile` to ensure 0 compiler errors.
   - If DB schema changed, verify Liquibase changesets are valid formatted SQL in `src/main/resources/db/changelog/changes/*.sql` and registered in `db.changelog-master.xml`.
2. **Frontend Verification**:
   - Run `cd D:\antigravity\software\Meal_Tracking_Fe; npm run build` to verify Next.js TypeScript compilation and build pass without errors.
3. **Documentation Updates**:
   - Update corresponding checklist in `D:\antigravity\software\docs\PHASE_1_CORE.md` and feature markdown file in `D:\antigravity\software\docs\features/`.
