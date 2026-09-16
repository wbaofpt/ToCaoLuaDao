CREATE DATABASE IF NOT EXISTS tocaoluadao CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tocaoluadao;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','moderator') DEFAULT 'moderator',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO users (full_name, email, password_hash, role)
VALUES ('Quản trị viên', 'admin@tocaoluadao.vn', '$2b$10$rmbBQebAKd9j1mlb2gS19eXutHJEwPECeO1S334PgqDAWfRXXIDlu', 'admin');

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
  status ENUM('pending','published','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
  tier ENUM('gold','silver') DEFAULT 'gold',
  category VARCHAR(80) DEFAULT 'Giao dịch viên',
  contact_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE admins ADD COLUMN IF NOT EXISTS slug VARCHAR(180) NULL;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS introduction TEXT;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS fanpage_url VARCHAR(255);
ALTER TABLE admins ADD COLUMN IF NOT EXISTS website_url VARCHAR(255);
ALTER TABLE admins ADD COLUMN IF NOT EXISTS zalo_contact VARCHAR(100);
ALTER TABLE admins ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP NULL;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS recommended_limit DECIMAL(15,2) DEFAULT 10000000;

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

ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_id INT NULL;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(140) NOT NULL UNIQUE,
  image_url VARCHAR(255),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE admins ADD COLUMN IF NOT EXISTS category_id INT NULL;
ALTER TABLE admins ADD CONSTRAINT fk_admin_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

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
  avatar_url = COALESCE(avatar_url, '/assets/image_56771365.png'),
  introduction = COALESCE(introduction, 'Giao dịch an toàn, hỗ trợ nhanh và minh bạch.'),
  verified_at = COALESCE(verified_at, NOW());

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
