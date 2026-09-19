CREATE DATABASE IF NOT EXISTS tocaoluadao CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tocaoluadao;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','moderator') DEFAULT 'moderator',
  is_active BOOLEAN DEFAULT TRUE,
  admin_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO users (full_name, email, password_hash, role)
VALUES ('Quản trị viên', 'admin@tocaoluadao.vn', '$2b$10$rmbBQebAKd9j1mlb2gS19eXutHJEwPECeO1S334PgqDAWfRXXIDlu', 'admin');

CREATE TABLE IF NOT EXISTS admin_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  services VARCHAR(255) NOT NULL,
  introduction TEXT NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scam_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  scammer_name VARCHAR(160) NOT NULL,
  account_number VARCHAR(80) NOT NULL,
  bank_name VARCHAR(80) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  phone VARCHAR(30),
  category VARCHAR(80) NOT NULL,
  platform VARCHAR(80),
  evidence_url TEXT,
  content TEXT NOT NULL,
  reporter_name VARCHAR(160) NOT NULL,
  reporter_phone VARCHAR(30) NOT NULL,
  reporter_email VARCHAR(190) NULL,
  status ENUM('pending','published','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_scam_identity (scammer_name, account_number, amount)
);

-- For an existing database, run this once if the column is not present:
-- ALTER TABLE scam_reports ADD COLUMN reporter_email VARCHAR(190) NULL AFTER reporter_phone;

INSERT IGNORE INTO scam_reports
  (scammer_name, account_number, bank_name, amount, phone, category, platform, content, reporter_name, reporter_phone, status, created_at)
VALUES
  ('Nguyễn Thanh Quang','090458524','BANK',150000,'0593313357','Giao dịch game','Facebook','Chuyển khoản nhưng không nhận được tài sản như thỏa thuận.','Kha Huynh','0900000001','published','2026-09-12 09:10:00'),
  ('Phan Trường Chiến','0383201559','VPBANK',1000000,'0383201559','Dịch vụ mạng xã hội','Zalo','Nhận tiền đặt cọc rồi ngắt liên lạc.','Đức Tiến','0900000002','published','2026-09-12 10:20:00'),
  ('Đại thành tề thiên','00000000000','TCB',40000,'0123456678','Giao dịch game','Facebook','Không thực hiện đúng nội dung giao dịch đã cam kết.','Trần Huy Thành','0900000003','published','2026-09-12 11:30:00'),
  ('Phạm Tấn Đạt','8864976078','BIDV',200000,'0369809185','Dịch vụ game','Zalo','Yêu cầu chuyển thêm phí sau khi nhận tiền.','Nhật Minh','0900000004','published','2026-09-11 08:15:00'),
  ('Nguyễn Minh Khang','0563230500','VPBANK',4850000,'0563230500','Mua bán tài khoản','Facebook','Thông tin tài khoản cung cấp không đúng mô tả.','Ducanh','0900000005','published','2026-09-11 12:05:00'),
  ('Dũng Lê','000005449721','BANK',1900000,'0005449721','Dịch vụ quảng cáo','Zalo','Không bàn giao dịch vụ sau khi nhận đủ tiền.','Văn Hòa','0900000006','published','2026-09-10 09:40:00'),
  ('Nguyễn Quốc Thành','6979688699','MB',4500000,'0375083845','Giao dịch game','Facebook','Hẹn nhiều lần nhưng không hoàn trả tiền.','Kha','0900000007','published','2026-09-10 10:15:00'),
  ('Trương Văn Anh','202278578888','TCB',18000,'0993936434','Dịch vụ mạng xã hội','Zalo','Giao dịch không được hoàn thành như thỏa thuận.','Tran Huy Thanh','0900000008','published','2026-09-10 13:25:00'),
  ('Nguyen Van A','4729494','MOMO',100000,'0923824888','Giao dịch game','Facebook','Có dấu hiệu giả mạo thông tin người bán.','Minh Anh','0900000009','published','2026-09-09 14:20:00'),
  ('Đinh Hoàng Minh','2809200766','TCB',1500000,'0799129609','Dịch vụ thiết kế','Zalo','Không phản hồi sau khi nhận cọc.','Quốc Bảo','0900000010','published','2026-09-09 15:00:00'),
  ('Lê Hoàng Nam','1100223344','ACB',320000,'0911223344','Giao dịch game','Facebook','Không giao vật phẩm sau thanh toán.','Minh Tâm','0900000011','published','2026-09-08 09:00:00'),
  ('Trần Minh Đức','2200334455','MB',750000,'0902334455','Dịch vụ quảng cáo','Zalo','Báo giá một lần và thu thêm nhiều khoản phí.','Hoài Nam','0900000012','published','2026-09-08 10:00:00'),
  ('Phạm Gia Bảo','3300445566','BIDV',900000,'0933445566','Mua bán tài khoản','Facebook','Tài khoản bàn giao không đăng nhập được.','Ngọc Lan','0900000013','published','2026-09-07 11:00:00'),
  ('Ngô Thành Công','4400556677','VPBANK',120000,'0984556677','Dịch vụ mạng xã hội','Zalo','Không cung cấp dịch vụ sau chuyển khoản.','Tuấn Anh','0900000014','published','2026-09-07 12:00:00'),
  ('Đỗ Nhật Minh','5500667788','TCB',2100000,'0975667788','Giao dịch game','Facebook','Sử dụng thông tin người khác để nhận tiền.','Thùy Linh','0900000015','published','2026-09-06 13:00:00'),
  ('Vũ Đức Anh','6600778899','ACB',450000,'0966778899','Dịch vụ thiết kế','Zalo','Không gửi sản phẩm theo thời hạn đã hứa.','Anh Khoa','0900000016','published','2026-09-06 14:00:00'),
  ('Hoàng Văn Long','7700889900','MB',680000,'0957889900','Giao dịch game','Facebook','Chặn liên lạc sau khi nhận tiền.','Mai Chi','0900000017','published','2026-09-05 08:30:00'),
  ('Nguyễn Tuấn Kiệt','8800990011','BANK',150000,'0948990011','Dịch vụ mạng xã hội','Zalo','Không hoàn tiền khi dịch vụ không thực hiện.','Hải Yến','0900000018','published','2026-09-05 09:30:00'),
  ('Bùi Quốc Huy','9900112233','BIDV',3000000,'0939112233','Mua bán tài khoản','Facebook','Tài khoản bị thu hồi ngay sau khi mua.','Thanh Tùng','0900000019','published','2026-09-04 10:30:00'),
  ('Mai Văn Phúc','1234005678','VPBANK',250000,'0922005678','Giao dịch game','Zalo','Không giao đúng sản phẩm trong bài đăng.','Huyền Trang','0900000020','published','2026-09-04 11:30:00'),
  ('Lý Minh Hoàng','2345116789','TCB',560000,'0913116789','Dịch vụ quảng cáo','Facebook','Thu phí nhưng không chạy quảng cáo.','Hoàng Anh','0900000021','published','2026-09-03 12:30:00'),
  ('Đặng Quang Vinh','3456227890','MB',820000,'0904227890','Dịch vụ thiết kế','Zalo','Bàn giao sản phẩm lỗi và không hỗ trợ.','Phương Thảo','0900000022','published','2026-09-03 13:30:00'),
  ('Trịnh Văn Sơn','4567338901','ACB',175000,'0895338901','Giao dịch game','Facebook','Dùng nhiều tài khoản để nhận tiền.','Gia Hân','0900000023','published','2026-09-02 14:30:00'),
  ('Hà Quốc Việt','5678449012','BANK',1300000,'0886449012','Dịch vụ mạng xã hội','Zalo','Không thực hiện đúng cam kết ban đầu.','Đức Anh','0900000024','published','2026-09-02 15:30:00'),
  ('Cao Minh Tân','6789550123','BIDV',980000,'0877550123','Mua bán tài khoản','Facebook','Gửi thông tin giả để yêu cầu chuyển khoản.','Nguyên Khang','0900000025','published','2026-09-01 16:30:00');

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(140) NOT NULL UNIQUE,
  image_url VARCHAR(255),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  avatar_url TEXT,
  introduction TEXT,
  fanpage_url VARCHAR(255),
  website_url VARCHAR(255),
  zalo_contact VARCHAR(100),
  verified_at TIMESTAMP NULL,
  recommended_limit DECIMAL(15,2) DEFAULT 10000000,
  category_id INT NULL,
  tier ENUM('gold','silver') DEFAULT 'gold',
  category VARCHAR(80) DEFAULT 'Giao dịch viên',
  contact_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_banks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  bank_name VARCHAR(120) NOT NULL,
  account_number VARCHAR(80) NOT NULL,
  account_holder VARCHAR(160) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_banks_profile FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_category_map (
  admin_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (admin_id, category_id),
  CONSTRAINT fk_admin_category_map_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  CONSTRAINT fk_admin_category_map_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  reviewer_name VARCHAR(160) NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_reviews_profile FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

INSERT IGNORE INTO categories (name, slug, image_url, sort_order) VALUES
('GD trung gian','gd-trung-gian','/assets/image_56771365.png',1),
('Dịch vụ Game','dich-vu-game','/assets/image_27055372.jpg',2),
('Dịch vụ FB','dich-vu-fb','/assets/image_81388629.png',3),
('Dịch vụ Tiktok','dich-vu-tiktok','/assets/image_69683321.png',4),
('Phần mềm','phan-mem','/assets/image_13920872.jpg',5),
('Tài nguyên ADS','tai-nguyen-ads','/assets/image_28131030.png',6),
('Dịch vụ MXH','dich-vu-mxh','/assets/image_12068156.jpg',7),
('Rút VTS','rut-vts','/assets/image_38280786.jfif',8),
('Liên Quân','lien-quan','/assets/image_73597256.jpg',9),
('Freefire','freefire','/assets/image_66794864.jfif',10),
('FC Mobile','fc-mobile','/assets/image_91309885.jpg',11),
('Roblox','roblox','/assets/image_68348443.png',12),
('PUBG','pubg','/assets/image_87051155.png',13),
('TFT','tft','/assets/image_17376650.jfif',14),
('Valorant','valorant','/assets/image_73623863.png',15),
('Đột Kích','dot-kich','/assets/image_93395952.jpg',16),
('FIFA Online 4','fifa-online-4','/assets/image_35402790.jfif',17),
('LOL','lol','/assets/image_72021952.png',18),
('Thiết Kế WEB','thiet-ke-web','/assets/image_65071586.png',19);

INSERT IGNORE INTO admins (name, slug, tier, category_id)
SELECT 'Trần Huy Thành', 'tran-huy-thanh', 'gold', id FROM categories WHERE slug = 'gd-trung-gian';
INSERT IGNORE INTO admins (name, slug, tier, category_id)
SELECT 'Gà Con Juice', 'ga-con-juice', 'gold', id FROM categories WHERE slug = 'dich-vu-game';
INSERT IGNORE INTO admins (name, slug, tier, category_id)
SELECT 'Ngô Hoàng Sơn', 'ngo-hoang-son', 'gold', id FROM categories WHERE slug = 'dich-vu-fb';
INSERT IGNORE INTO admins (name, slug, tier, category_id)
SELECT 'Ngô Văn Bắp', 'ngo-van-bap', 'gold', id FROM categories WHERE slug = 'dich-vu-tiktok';
INSERT IGNORE INTO admins (name, slug, tier, category_id)
SELECT 'Nguyễn Trọng Đại', 'nguyen-trong-dai', 'gold', id FROM categories WHERE slug = 'phan-mem';
INSERT IGNORE INTO admins (name, slug, tier, category_id)
SELECT 'Nguyễn Việt Anh', 'nguyen-viet-anh', 'gold', id FROM categories WHERE slug = 'tai-nguyen-ads';
INSERT IGNORE INTO admins (name, slug, tier, category_id)
SELECT 'Đặng Thế Bình', 'dang-the-binh', 'gold', id FROM categories WHERE slug = 'dich-vu-mxh';
INSERT IGNORE INTO admins (name, slug, tier, category_id)
SELECT 'Triết Béo', 'triet-beo', 'gold', id FROM categories WHERE slug = 'lien-quan';
INSERT IGNORE INTO admins (name, slug, tier, category_id)
SELECT 'Hải Đinh', 'hai-dinh', 'gold', id FROM categories WHERE slug = 'freefire';

UPDATE admins SET
  slug = CASE name
    WHEN 'Trần Huy Thành' THEN 'tran-huy-thanh'
    WHEN 'Gà Con Juice' THEN 'ga-con-juice'
    WHEN 'Ngô Hoàng Sơn' THEN 'ngo-hoang-son'
    WHEN 'Ngô Văn Bắp' THEN 'ngo-van-bap'
    WHEN 'Nguyễn Trọng Đại' THEN 'nguyen-trong-dai'
    WHEN 'Nguyễn Việt Anh' THEN 'nguyen-viet-anh'
    WHEN 'Đặng Thế Bình' THEN 'dang-the-binh'
    WHEN 'Triết Béo' THEN 'triet-beo'
    WHEN 'Hải Đinh' THEN 'hai-dinh'
  END,
  introduction = COALESCE(introduction, 'Giao dịch an toàn, hỗ trợ nhanh và minh bạch.'),
  verified_at = COALESCE(verified_at, NOW())
WHERE id > 0;

UPDATE admins SET
  introduction = 'Dịch vụ Facebook\nDịch vụ Tiktok\nDịch vụ Game',
  avatar_url = '/assets/image_56771365.png',
  fanpage_url = 'https://facebook.com/',
  zalo_contact = 'Liên hệ Zalo để được hỗ trợ',
  recommended_limit = 10000000
WHERE slug = 'ga-con-juice';

INSERT IGNORE INTO admin_banks (admin_id, bank_name, account_number, account_holder)
SELECT id, 'MBANK', '000026666', 'LA THÚY NGA' FROM admins WHERE slug = 'ga-con-juice';

INSERT IGNORE INTO admin_category_map (admin_id, category_id)
SELECT a.id, c.id FROM admins a JOIN categories c ON c.slug IN ('dich-vu-game','tai-nguyen-ads','dich-vu-mxh') WHERE a.slug = 'ga-con-juice';

INSERT IGNORE INTO admin_reviews (admin_id, reviewer_name, rating, content)
SELECT id, 'Trần Huy Thành', 4, 'uy tín' FROM admins WHERE slug = 'ga-con-juice';

UPDATE users u JOIN admins a ON a.slug = 'ga-con-juice'
SET u.admin_id = a.id
WHERE u.email = 'admin@tocaoluadao.vn';
