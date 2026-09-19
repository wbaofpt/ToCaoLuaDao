USE tocaoluadao;

-- Chạy một lần trên database hiện tại để lưu thông tin CCCD của đơn đăng ký admin.
ALTER TABLE admin_applications
  ADD COLUMN cccd_number VARCHAR(20) NULL AFTER phone,
  ADD COLUMN cccd_front_url VARCHAR(255) NULL AFTER cccd_number,
  ADD COLUMN cccd_back_url VARCHAR(255) NULL AFTER cccd_front_url;
