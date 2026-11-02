--liquibase formatted sql

--changeset antigravity:007-create-supplier-food-partners-table
CREATE TABLE IF NOT EXISTS supplier_food_partners (
    id BIGSERIAL PRIMARY KEY,
    supplier_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    representative VARCHAR(100),
    phone VARCHAR(30),
    email VARCHAR(100),
    address TEXT NOT NULL,
    supplied_products TEXT NOT NULL,
    contract_number VARCHAR(100),
    contract_start_date DATE,
    contract_end_date DATE,
    certifications TEXT,
    certificate_files TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_supplier_food_partners_supplier ON supplier_food_partners(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_food_partners_cat ON supplier_food_partners(supplier_id, category);
CREATE INDEX IF NOT EXISTS idx_supplier_food_partners_status ON supplier_food_partners(supplier_id, status);

--changeset antigravity:007-create-supplier-clients-table
CREATE TABLE IF NOT EXISTS supplier_clients (
    id BIGSERIAL PRIMARY KEY,
    supplier_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    client_type VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    representative_name VARCHAR(100) NOT NULL,
    representative_title VARCHAR(100),
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(100),
    contract_number VARCHAR(100) NOT NULL,
    daily_servings INT NOT NULL DEFAULT 0,
    price_per_serving DOUBLE PRECISION NOT NULL DEFAULT 0,
    contract_start_date DATE NOT NULL,
    contract_end_date DATE NOT NULL,
    contract_pdf_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_supplier_clients_supplier ON supplier_clients(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_clients_type ON supplier_clients(supplier_id, client_type);
CREATE INDEX IF NOT EXISTS idx_supplier_clients_status ON supplier_clients(supplier_id, status);
