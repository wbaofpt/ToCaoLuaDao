USE tocaoluadao;

-- Chạy một lần trên database hiện tại để lưu URL liên hệ/website của admin.
ALTER TABLE admin_applications
  ADD COLUMN website_url VARCHAR(255) NULL AFTER cccd_back_url;
