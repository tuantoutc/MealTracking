-- ==============================================================================
-- DATABASE SCHEMA - HỆ THỐNG GIÁM SÁT SUẤT ĂN BÁN TRÚ (PHASE 1 CORE)
-- Hệ quản trị CSDL: PostgreSQL 16+
-- ==============================================================================

-- 1. BẢNG CA SUẤT ĂN HẰNG NGÀY (Meal Batches)
CREATE TABLE IF NOT EXISTS meal_batches (
    id BIGSERIAL PRIMARY KEY,
    batch_code VARCHAR(50) NOT NULL UNIQUE,          -- vd: BATCH-20261028-001
    batch_date DATE NOT NULL,                        -- Ngày phục vụ suất ăn
    supplier_id BIGINT NOT NULL REFERENCES users(id),-- Bếp trung tâm / Nhà cung cấp
    school_name VARCHAR(150) NOT NULL,               -- Tên trường tiếp nhận
    status VARCHAR(50) NOT NULL DEFAULT 'REGISTERED',-- 6 trạng thái State Machine
    head_chef_name VARCHAR(150) NOT NULL,            -- Bếp trưởng nấu ca hôm nay
    qa_manager_name VARCHAR(150) NOT NULL,           -- Phụ trách KCS/An toàn thực phẩm
    planned_quantity INT NOT NULL CHECK (planned_quantity > 0), -- Số suất bàn giao theo hợp đồng
    vehicle_type VARCHAR(100),                       -- Loại xe vận chuyển
    vehicle_plate VARCHAR(30) NOT NULL,              -- Biển số xe giao nhận
    driver_name VARCHAR(100) NOT NULL,               -- Họ tên tài xế
    driver_phone VARCHAR(20) NOT NULL,               -- Số điện thoại tài xế
    assistant_name VARCHAR(100),                     -- Phụ xe (nếu có)
    dispatch_time TIMESTAMP WITH TIME ZONE,          -- Giờ xuất bến từ bếp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_meal_batches_date_status ON meal_batches(batch_date, status);
CREATE INDEX IF NOT EXISTS idx_meal_batches_code ON meal_batches(batch_code);

-- 2. BẢNG CHI TIẾT THỰC ĐƠN & ĐỊNH LƯỢNG MÓN ĂN (Batch Menu Items)
CREATE TABLE IF NOT EXISTS batch_menu_items (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL REFERENCES meal_batches(id) ON DELETE CASCADE,
    item_name VARCHAR(200) NOT NULL,                 -- Tên món (Thịt kho trứng, Canh chua...)
    category VARCHAR(50) NOT NULL,                   -- Mặn, Rau/Xào, Canh, Tráng miệng, Cơm
    standard_portion_amount DOUBLE PRECISION NOT NULL,-- Định lượng chuẩn trên 1 suất (90, 200...)
    unit VARCHAR(10) NOT NULL,                       -- g, ml, quả
    ingredient_origin TEXT NOT NULL,                 -- Nguồn gốc (Thịt lợn CP, Rau HTX Vân Nội)
    invoice_reference VARCHAR(150),                  -- Hóa đơn chứng từ #1234
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_batch_menu_items_batch ON batch_menu_items(batch_id);

-- 3. BẢNG BIÊN BẢN GIAO NHẬN TẠI CỔNG TRƯỜNG (Gate Handovers)
CREATE TABLE IF NOT EXISTS gate_handovers (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL UNIQUE REFERENCES meal_batches(id) ON DELETE CASCADE,
    receiver_id BIGINT NOT NULL REFERENCES users(id),-- Đại diện trường (Y tế/Thường trực bán trú)
    actual_quantity_received INT NOT NULL,           -- Số lượng suất ăn thực nhận
    quantity_difference INT NOT NULL,                -- delta = actual - planned
    is_shortage BOOLEAN NOT NULL DEFAULT FALSE,      -- TRUE nếu delta < 0
    shortage_compensation_plan TEXT,                 -- Phương án cấp bù nếu thiếu suất (< 11:00)
    temperature_celsius DOUBLE PRECISION NOT NULL,   -- Nhiệt độ cảm quan khi mở thùng bảo ôn
    is_temperature_passed BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE nếu nhiệt độ > 60°C
    seal_intact BOOLEAN NOT NULL DEFAULT TRUE,       -- Tình trạng niêm phong thùng bảo ôn
    handover_otp VARCHAR(10) NOT NULL,               -- Mã xác thực hoặc chữ ký điện tử PIN
    signed_at TIMESTAMP WITH TIME ZONE NOT NULL,     -- Thời điểm ký biên bản
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_gate_handovers_batch ON gate_handovers(batch_id);

-- 4. BẢNG ẢNH SUẤT ĂN TIÊU CHUẨN BENCHMARK (Benchmark Portions)
CREATE TABLE IF NOT EXISTS benchmark_portions (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL UNIQUE REFERENCES meal_batches(id) ON DELETE CASCADE,
    nutritionist_id BIGINT NOT NULL REFERENCES users(id), -- Cán bộ y tế/dinh dưỡng trường
    model_type VARCHAR(20) NOT NULL,                 -- MODEL_A (bếp chia) | MODEL_B (trường chia)
    benchmark_photo_url VARCHAR(500) NOT NULL,       -- Link ảnh suất chuẩn Benchmark
    photo_captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_portioning_sufficient BOOLEAN NOT NULL DEFAULT TRUE,
    approved_at TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT
);

-- 5. BẢNG BÀN GIAO & PHỤC VỤ TẠI LỚP HỌC (Class Servings)
CREATE TABLE IF NOT EXISTS class_servings (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL REFERENCES meal_batches(id) ON DELETE CASCADE,
    class_name VARCHAR(50) NOT NULL,                 -- Tên lớp (vd: 1A1, 2A3, 5A2)
    teacher_id BIGINT NOT NULL REFERENCES users(id), -- Giáo viên chủ nhiệm phụ trách lớp
    total_students INT NOT NULL,                     -- Sĩ số lớp
    eating_students INT NOT NULL,                    -- Sĩ số ăn bán trú hôm nay
    received_trays INT NOT NULL,                     -- Số khay cơm nhận thực tế tại lớp
    eating_start_time TIMESTAMP WITH TIME ZONE,      -- Thời điểm học sinh ngồi vào bàn ăn
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',   -- PENDING -> SERVED -> COMPLETED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_batch_class UNIQUE (batch_id, class_name)
);

CREATE INDEX IF NOT EXISTS idx_class_servings_batch_class ON class_servings(batch_id, class_name);

-- 6. BẢNG 3 ẢNH KHAY CƠM TẠI LỚP - TRI-PHOTO COMPLIANCE (Classroom Meal Photos)
CREATE TABLE IF NOT EXISTS classroom_meal_photos (
    id BIGSERIAL PRIMARY KEY,
    class_serving_id BIGINT NOT NULL REFERENCES class_servings(id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,                 -- URL ảnh trên MinIO / S3
    photo_hash VARCHAR(64) NOT NULL,                 -- Mã SHA-256 chống tải trùng lặp ảnh
    watermark_text VARCHAR(255) NOT NULL,            -- [Tên Trường - Tên Lớp] - [Giờ] - [Ca ăn]
    captured_at TIMESTAMP WITH TIME ZONE NOT NULL,   -- Thời điểm chụp camera
    order_index INT NOT NULL CHECK (order_index BETWEEN 1 AND 3), -- Khay số 1, 2, 3
    CONSTRAINT uq_serving_photo_order UNIQUE (class_serving_id, order_index),
    CONSTRAINT uq_serving_photo_hash UNIQUE (class_serving_id, photo_hash) -- Chặn cùng 1 hash trong 1 lớp
);

-- 7. BẢNG KHAI BÁO LƯU MẪU THỨC ĂN 24H - BỘ Y TẾ (Food Samples 24H)
CREATE TABLE IF NOT EXISTS food_samples_24h (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL REFERENCES meal_batches(id) ON DELETE CASCADE,
    sample_seal_code VARCHAR(100) NOT NULL,          -- Mã niêm phong hũ lưu mẫu
    item_name VARCHAR(200) NOT NULL,                 -- Tên món lưu mẫu
    storage_location VARCHAR(150) NOT NULL,          -- Tủ lạnh lưu mẫu chuyên dụng
    storage_temperature DOUBLE PRECISION NOT NULL CHECK (storage_temperature BETWEEN 2 AND 8), -- 2°C - 8°C
    sampler_id BIGINT NOT NULL REFERENCES users(id), -- Người trực tiếp thực hiện lưu mẫu
    sampled_at TIMESTAMP WITH TIME ZONE NOT NULL,    -- Giờ lưu mẫu
    dispose_at TIMESTAMP WITH TIME ZONE NOT NULL,    -- Giờ hủy mẫu (sau 24h)
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_food_samples_batch ON food_samples_24h(batch_id);

-- 8. BẢNG ĐÁNH GIÁ & PHẢN HỒI CỦA PHỤ HUYNH (Parent Feedbacks)
CREATE TABLE IF NOT EXISTS parent_feedbacks (
    id BIGSERIAL PRIMARY KEY,
    class_serving_id BIGINT NOT NULL REFERENCES class_servings(id) ON DELETE CASCADE,
    parent_id BIGINT NOT NULL REFERENCES users(id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5), -- Chấm điểm 1 - 5 sao
    comment TEXT,                                    -- Nhận xét: cơm vơi, cơm nguội, rau không tươi...
    tags VARCHAR(255),                               -- Tags nhanh (KHAY_VOI, COM_NGUOI, NGON_MIENG...)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_parent_feedbacks_serving ON parent_feedbacks(class_serving_id);
