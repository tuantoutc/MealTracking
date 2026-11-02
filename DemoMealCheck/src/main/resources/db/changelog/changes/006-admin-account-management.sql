--liquibase formatted sql

--changeset antigravity:006-insert-additional-roles
INSERT INTO roles (name) VALUES ('ROLE_WARD_OFFICER') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_PRINCIPAL') ON CONFLICT (name) DO NOTHING;

--changeset antigravity:006-add-user-approval-and-verification-columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS requested_role VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS approval_status VARCHAR(30) NOT NULL DEFAULT 'APPROVED';
ALTER TABLE users ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token_expiry TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified_badge BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS badge_requested BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS badge_request_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS warning_message TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS warning_count INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked BOOLEAN NOT NULL DEFAULT FALSE;

--changeset antigravity:006-create-account-warnings-table
CREATE TABLE IF NOT EXISTS account_warnings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    admin_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    warning_title VARCHAR(200) NOT NULL,
    warning_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--changeset antigravity:006-create-user-management-indices
CREATE INDEX IF NOT EXISTS idx_users_approval_status ON users(approval_status);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_account_warnings_user ON account_warnings(user_id);
