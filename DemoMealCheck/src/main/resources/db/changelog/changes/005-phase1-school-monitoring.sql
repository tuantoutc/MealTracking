--liquibase formatted sql

--changeset antigravity:005-create-meal-batches-table
CREATE TABLE IF NOT EXISTS meal_batches (
    id BIGSERIAL PRIMARY KEY,
    batch_code VARCHAR(50) NOT NULL UNIQUE,
    batch_date DATE NOT NULL,
    supplier_id BIGINT NOT NULL REFERENCES users(id),
    school_name VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'REGISTERED',
    head_chef_name VARCHAR(150) NOT NULL,
    qa_manager_name VARCHAR(150) NOT NULL,
    planned_quantity INT NOT NULL CHECK (planned_quantity > 0),
    vehicle_type VARCHAR(100),
    vehicle_plate VARCHAR(30) NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    driver_phone VARCHAR(20) NOT NULL,
    assistant_name VARCHAR(100),
    dispatch_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_meal_batches_date_status ON meal_batches(batch_date, status);
CREATE INDEX IF NOT EXISTS idx_meal_batches_code ON meal_batches(batch_code);

--changeset antigravity:005-create-batch-menu-items-table
CREATE TABLE IF NOT EXISTS batch_menu_items (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL REFERENCES meal_batches(id) ON DELETE CASCADE,
    item_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    standard_portion_amount DOUBLE PRECISION NOT NULL,
    unit VARCHAR(10) NOT NULL,
    ingredient_origin TEXT NOT NULL,
    invoice_reference VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_batch_menu_items_batch ON batch_menu_items(batch_id);

--changeset antigravity:005-create-gate-handovers-table
CREATE TABLE IF NOT EXISTS gate_handovers (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL UNIQUE REFERENCES meal_batches(id) ON DELETE CASCADE,
    receiver_id BIGINT NOT NULL REFERENCES users(id),
    actual_quantity_received INT NOT NULL,
    quantity_difference INT NOT NULL,
    is_shortage BOOLEAN NOT NULL DEFAULT FALSE,
    shortage_compensation_plan TEXT,
    temperature_celsius DOUBLE PRECISION NOT NULL,
    is_temperature_passed BOOLEAN NOT NULL DEFAULT TRUE,
    seal_intact BOOLEAN NOT NULL DEFAULT TRUE,
    handover_otp VARCHAR(10) NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_gate_handovers_batch ON gate_handovers(batch_id);

--changeset antigravity:005-create-benchmark-portions-table
CREATE TABLE IF NOT EXISTS benchmark_portions (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL UNIQUE REFERENCES meal_batches(id) ON DELETE CASCADE,
    nutritionist_id BIGINT NOT NULL REFERENCES users(id),
    model_type VARCHAR(20) NOT NULL,
    benchmark_photo_url VARCHAR(500) NOT NULL,
    photo_captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_portioning_sufficient BOOLEAN NOT NULL DEFAULT TRUE,
    approved_at TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT
);

--changeset antigravity:005-create-class-servings-table
CREATE TABLE IF NOT EXISTS class_servings (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL REFERENCES meal_batches(id) ON DELETE CASCADE,
    class_name VARCHAR(50) NOT NULL,
    teacher_id BIGINT NOT NULL REFERENCES users(id),
    total_students INT NOT NULL,
    eating_students INT NOT NULL,
    received_trays INT NOT NULL,
    eating_start_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_batch_class UNIQUE (batch_id, class_name)
);

CREATE INDEX IF NOT EXISTS idx_class_servings_batch_class ON class_servings(batch_id, class_name);

--changeset antigravity:005-create-classroom-meal-photos-table
CREATE TABLE IF NOT EXISTS classroom_meal_photos (
    id BIGSERIAL PRIMARY KEY,
    class_serving_id BIGINT NOT NULL REFERENCES class_servings(id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    photo_hash VARCHAR(64) NOT NULL,
    watermark_text VARCHAR(255) NOT NULL,
    captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    order_index INT NOT NULL CHECK (order_index BETWEEN 1 AND 3),
    CONSTRAINT uq_serving_photo_order UNIQUE (class_serving_id, order_index),
    CONSTRAINT uq_serving_photo_hash UNIQUE (class_serving_id, photo_hash)
);

--changeset antigravity:005-create-food-samples-24h-table
CREATE TABLE IF NOT EXISTS food_samples_24h (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL REFERENCES meal_batches(id) ON DELETE CASCADE,
    sample_seal_code VARCHAR(100) NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    storage_location VARCHAR(150) NOT NULL,
    storage_temperature DOUBLE PRECISION NOT NULL CHECK (storage_temperature BETWEEN 2 AND 8),
    sampler_id BIGINT NOT NULL REFERENCES users(id),
    sampled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    dispose_at TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_food_samples_batch ON food_samples_24h(batch_id);

--changeset antigravity:005-create-parent-feedbacks-table
CREATE TABLE IF NOT EXISTS parent_feedbacks (
    id BIGSERIAL PRIMARY KEY,
    class_serving_id BIGINT NOT NULL REFERENCES class_servings(id) ON DELETE CASCADE,
    parent_id BIGINT NOT NULL REFERENCES users(id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    tags VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_parent_feedbacks_serving ON parent_feedbacks(class_serving_id);
