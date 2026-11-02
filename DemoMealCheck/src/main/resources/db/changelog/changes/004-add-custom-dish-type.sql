--liquibase formatted sql

--changeset antigravity:004-add-custom-dish-type splitStatements:false
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'meals' AND column_name = 'custom_dish_type'
    ) THEN
        ALTER TABLE meals ADD COLUMN custom_dish_type VARCHAR(100);
    END IF;
END $$;
