USE tocaoluadao;

-- Chạy một lần trên database hiện tại để lưu tài khoản ngân hàng đăng ký.
ALTER TABLE admin_applications
  ADD COLUMN bank_name VARCHAR(120) NULL AFTER website_url,
  ADD COLUMN bank_account_number VARCHAR(80) NULL AFTER bank_name,
  ADD COLUMN bank_account_holder VARCHAR(160) NULL AFTER bank_account_number;
