USE tocaoluadao;

-- Chạy một lần trên database hiện tại để bật email trạng thái cho người tố cáo.
ALTER TABLE scam_reports
  ADD COLUMN reporter_email VARCHAR(190) NULL AFTER reporter_phone;
