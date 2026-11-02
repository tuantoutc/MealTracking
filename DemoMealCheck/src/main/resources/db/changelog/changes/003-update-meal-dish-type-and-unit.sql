--liquibase formatted sql

--changeset antigravity:003-update-meal-dish-type-and-unit splitStatements:false
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'meals' AND column_name = 'dish_type'
    ) THEN
ALTER TABLE meals ADD COLUMN dish_type VARCHAR(50) NOT NULL DEFAULT 'CANH';
END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'meals' AND column_name = 'amount'
    ) THEN
ALTER TABLE meals ADD COLUMN amount DOUBLE PRECISION NOT NULL DEFAULT 0;
END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'meals' AND column_name = 'unit'
    ) THEN
ALTER TABLE meals ADD COLUMN unit VARCHAR(10) NOT NULL DEFAULT 'g';
END IF;
END $$;

--changeset antigravity:003-drop-legacy-macro-columns
ALTER TABLE meals DROP COLUMN IF EXISTS calories;
ALTER TABLE meals DROP COLUMN IF EXISTS protein;
ALTER TABLE meals DROP COLUMN IF EXISTS carbs;
ALTER TABLE meals DROP COLUMN IF EXISTS fat;
ALTER TABLE meals DROP COLUMN IF EXISTS meal_type;