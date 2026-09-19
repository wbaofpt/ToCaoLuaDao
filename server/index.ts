import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import nodemailer from "nodemailer";
import { pool } from "./db";
import { renderStatusEmail } from "./email";

const app = express();
const JWT_SECRET = process.env.JWT_SECRET ?? "change-this-secret-in-production";
const cccdUploadDir = path.resolve(process.cwd(), "public/uploads/cccd");
fs.mkdirSync(cccdUploadDir, { recursive: true });
const evidenceUploadDir = path.resolve(
  process.cwd(),
  "public/uploads/evidence",
);
fs.mkdirSync(evidenceUploadDir, { recursive: true });
const cccdUpload = multer({
  storage: multer.diskStorage({
    destination: cccdUploadDir,
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(
        null,
        `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`,
      );
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    callback(
      null,
      ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype),
    );
  },
});
const evidenceUpload = multer({
  storage: multer.diskStorage({
    destination: evidenceUploadDir,
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(
        null,
        `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`,
      );
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, callback) => {
    callback(
      null,
      ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype),
    );
  },
});
const mailer =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: Number(process.env.SMTP_PORT ?? 587) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    : null;

async function sendStatusEmail(
  to: string | undefined,
  subject: string,
  text: string,
) {
  if (!to) return;
  if (!mailer) {
    console.warn(`[email] SMTP chưa được cấu hình, bỏ qua email tới ${to}`);
    return;
  }
  try {
    await mailer.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to,
      subject,
      text,
      html: renderStatusEmail(subject, text),
    });
  } catch (error) {
    console.error(`[email] Không thể gửi email tới ${to}`, error);
  }
}
app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "public/uploads")),
);
type AuthRequest = express.Request & {
  auth?: { id?: number; adminId?: number; role?: string; email?: string };
};

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token ?? "", JWT_SECRET) as {
      id?: number;
      adminId?: number;
      role?: string;
      email?: string;
    };
    if (payload.role !== "admin" && payload.role !== "moderator")
      return res.status(403).json({ message: "Không đủ quyền truy cập." });
    (req as AuthRequest).auth = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ." });
  }
}

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Vui lòng nhập email và mật khẩu." });
  try {
    const [rows] = await pool.query(
      "SELECT id, admin_id AS adminId, full_name AS fullName, email, password_hash AS passwordHash, role FROM users WHERE email = ? AND is_active = 1 LIMIT 1",
      [email],
    );
    const user = (
      rows as Array<{
        id: number;
        adminId?: number;
        fullName: string;
        email: string;
        passwordHash: string;
        role: string;
      }>
    )[0];
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng." });
    const token = jwt.sign(
      {
        id: user.id,
        adminId: user.adminId,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "8h" },
    );
    return res.json({
      token,
      user: {
        id: user.id,
        adminId: user.adminId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    if (email === "admin@tocaoluadao.vn" && password === "Admin@123") {
      const token = jwt.sign(
        { id: 1, adminId: 1, role: "admin", email },
        JWT_SECRET,
        {
          expiresIn: "8h",
        },
      );
      return res.json({
        token,
        user: {
          id: 1,
          adminId: 1,
          fullName: "Quản trị viên",
          email,
          role: "admin",
        },
      });
    }
    return res.status(503).json({ message: "Chưa kết nối được MySQL." });
  }
});

const fallbackAdminProfile = {
  id: 1,
  name: "Gà Con Juice",
  slug: "ga-con-juice",
  avatarUrl: "/assets/image_56771365.png",
  introduction: "Dịch vụ Facebook\nDịch vụ Tiktok\nDịch vụ Game",
  fanpageUrl: "https://facebook.com/",
  websiteUrl: "",
  zaloContact: "Liên hệ Zalo để được hỗ trợ",
  recommendedLimit: 10000000,
  verified: true,
  banks: [
    {
      id: 1,
      bankName: "MBANK",
      accountNumber: "000026666",
      accountHolder: "LA THÚY NGA",
    },
  ],
  services: [
    {
      name: "Dịch vụ Game",
      imageUrl: "/assets/image_27055372.jpg",
      slug: "dich-vu-game",
    },
    {
      name: "Tài nguyên ADS",
      imageUrl: "/assets/image_28131030.png",
      slug: "tai-nguyen-ads",
    },
    {
      name: "Dịch vụ MXH",
      imageUrl: "/assets/image_12068156.jpg",
      slug: "dich-vu-mxh",
    },
  ],
  reviews: [
    {
      reviewerName: "Tran Huy Thanh",
      rating: 4,
      content: "uy tín",
      createdAt: "03/09/2026",
      messages: 14,
    },
  ],
};

app.get("/api/admins/:slug", async (req, res) => {
  try {
    const [profileRows] = await pool.query(
      "SELECT id, name, slug, avatar_url AS avatarUrl, introduction, fanpage_url AS fanpageUrl, website_url AS websiteUrl, zalo_contact AS zaloContact, recommended_limit AS recommendedLimit, verified_at IS NOT NULL AS verified FROM admins WHERE slug = ? LIMIT 1",
      [req.params.slug],
    );
    const profile = (profileRows as Array<Record<string, unknown>>)[0];
    if (!profile)
      return res.status(404).json({ message: "Không tìm thấy admin." });
    if (!profile)
      return req.params.slug === fallbackAdminProfile.slug
        ? res.json(fallbackAdminProfile)
        : res.status(404).json({ message: "Không tìm thấy admin." });
    const id = profile.id;
    const [banks] = await pool.query(
      "SELECT id, bank_name AS bankName, account_number AS accountNumber, account_holder AS accountHolder FROM admin_banks WHERE admin_id = ? AND is_active = 1 ORDER BY id",
      [id],
    );
    const [services] = await pool.query(
      "SELECT c.name, c.slug, c.image_url AS imageUrl FROM admin_category_map m JOIN categories c ON c.id = m.category_id WHERE m.admin_id = ? ORDER BY c.sort_order",
      [id],
    );
    const [reviews] = await pool.query(
      "SELECT reviewer_name AS reviewerName, rating, content, DATE_FORMAT(created_at, '%d/%m/%Y') AS createdAt, 0 AS messages FROM admin_reviews WHERE admin_id = ? ORDER BY created_at DESC",
      [id],
    );
    return res.json({ ...profile, banks, services, reviews });
  } catch {
    return res.status(503).json({ message: "Chưa kết nối được MySQL." });
    return req.params.slug === fallbackAdminProfile.slug
      ? res.json(fallbackAdminProfile)
      : res.status(503).json({ message: "Chưa kết nối được MySQL." });
  }
});

app.patch("/api/admin/me/profile", requireAdmin, async (req, res) => {
  const auth = (req as AuthRequest).auth;
  const adminId = auth?.adminId ?? 1;
  const {
    name,
    avatarUrl,
    introduction,
    fanpageUrl,
    websiteUrl,
    zaloContact,
    recommendedLimit,
  } = req.body as Record<string, string | number>;
  try {
    await pool.execute(
      "UPDATE admins SET name = COALESCE(?, name), avatar_url = COALESCE(?, avatar_url), introduction = COALESCE(?, introduction), fanpage_url = COALESCE(?, fanpage_url), website_url = COALESCE(?, website_url), zalo_contact = COALESCE(?, zalo_contact), recommended_limit = COALESCE(?, recommended_limit) WHERE id = ?",
      [
        name,
        avatarUrl,
        introduction,
        fanpageUrl,
        websiteUrl,
        zaloContact,
        recommendedLimit,
        adminId,
      ],
    );
    if (name)
      await pool.execute("UPDATE users SET full_name = ? WHERE id = ?", [
        name,
        auth?.id ?? 1,
      ] as [string, number]);
    return res.json({ message: "Đã cập nhật hồ sơ admin." });
  } catch {
    return res.status(500).json({ message: "Không thể cập nhật hồ sơ." });
  }
});

app.get("/api/admin/me/profile", requireAdmin, async (req, res) => {
  const adminId = (req as AuthRequest).auth?.adminId ?? 1;
  try {
    const [rows] = await pool.query(
      "SELECT id, name, slug, avatar_url AS avatarUrl, introduction, fanpage_url AS fanpageUrl, website_url AS websiteUrl, zalo_contact AS zaloContact, recommended_limit AS recommendedLimit FROM admins WHERE id = ? LIMIT 1",
      [adminId],
    );
    const profile = (rows as Array<Record<string, unknown>>)[0];
    return profile
      ? res.json(profile)
      : res.status(404).json({ message: "Chưa có hồ sơ admin." });
  } catch {
    return res.status(503).json({ message: "Chưa kết nối được MySQL." });
  }
});

app.get("/api/admin/reports", requireAdmin, async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, scammer_name AS scammerName, reporter_name AS reporterName, reporter_phone AS reporterPhone, amount, status, created_at AS createdAt FROM scam_reports ORDER BY created_at DESC",
    );
    return res.json(rows);
  } catch {
    return res.json([]);
  }
});

app.patch("/api/admin/reports/:id", requireAdmin, async (req, res) => {
  const status = req.body.status === "published" ? "published" : "rejected";
  try {
    const [rows] = await pool.query(
      "SELECT reporter_email AS reporterEmail, scammer_name AS scammerName FROM scam_reports WHERE id = ? LIMIT 1",
      [req.params.id],
    );
    await pool.execute("UPDATE scam_reports SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);
    const report = (
      rows as Array<{ reporterEmail?: string; scammerName?: string }>
    )[0];
    await sendStatusEmail(
      report?.reporterEmail,
      `Cập nhật tố cáo: ${status === "published" ? "đã được duyệt" : "đã bị từ chối"}`,
      `Tố cáo về "${report?.scammerName ?? "đối tượng"}" của bạn ${status === "published" ? "đã được duyệt và công khai" : "chưa được duyệt"}.`,
    );
    return res.json({ message: "Đã cập nhật trạng thái tố cáo.", status });
  } catch {
    return res.status(500).json({ message: "Không thể cập nhật tố cáo." });
  }
});

const scams = [
  {
    name: "Nguyễn Thanh Quang",
    amount: "150.000đ",
    account: "090458524",
    bank: "BANK",
    views: 56,
    date: "12/09/2026",
  },
  {
    name: "Phan Trường Chiến",
    amount: "1.000.000đ",
    account: "0383201559",
    bank: "VPBANK",
    views: 48,
    date: "12/09/2026",
  },
  {
    name: "Đại thánh tề thiên",
    amount: "40.000đ",
    account: "00000000000",
    bank: "TCB",
    views: 20,
    date: "12/09/2026",
  },
  {
    name: "Phạm Tấn Đạt",
    amount: "200.000đ",
    account: "8864976078",
    bank: "BIDV",
    views: 10,
    date: "11/09/2026",
  },
  {
    name: "Nguyễn Minh Khang",
    amount: "4.850.000đ",
    account: "0563230500",
    bank: "VPBANK",
    views: 21,
    date: "11/09/2026",
  },
  {
    name: "Dũng Lê",
    amount: "1.900.000đ",
    account: "000005449721",
    bank: "BANK",
    views: 15,
    date: "10/09/2026",
  },
  {
    name: "Nguyễn Quốc Thành",
    amount: "4.500.000đ",
    account: "6979688699",
    bank: "MB",
    views: 22,
    date: "10/09/2026",
  },
];
const localCategories = [
  "GD trung gian",
  "Dịch vụ Game",
  "Dịch vụ FB",
  "Dịch vụ Tiktok",
  "Phần mềm",
  "Tài nguyên ADS",
  "Dịch vụ MXH",
  "Rút VTS",
  "Liên Quân",
  "Freefire",
  "FC Mobile",
  "Roblox",
  "PUBG",
  "TFT",
  "Valorant",
  "Đột Kích",
  "FIFA Online 4",
  "LOL",
  "Thiết Kế WEB",
];

app.get("/api/categories", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, slug, image_url AS imageUrl FROM categories ORDER BY sort_order, id",
    );
    return res.json(rows);
  } catch {
    return res.status(503).json({ message: "Chưa kết nối được MySQL." });
  }
});

app.get("/api/admins", async (req, res) => {
  const category = String(req.query.category ?? "");
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT a.id, a.name, a.slug, a.avatar_url AS avatarUrl, a.tier, COALESCE(mapped.name, legacy.name) AS category FROM admins a LEFT JOIN admin_category_map map ON map.admin_id = a.id LEFT JOIN categories mapped ON mapped.id = map.category_id LEFT JOIN categories legacy ON legacy.id = a.category_id WHERE (? = "" OR mapped.slug = ? OR legacy.slug = ?) ORDER BY a.tier, a.name',
      [category, category, category],
    );
    return res.json(rows);
  } catch {
    return res.status(503).json({ message: "Chưa kết nối được MySQL." });
  }
});

app.get("/api/stats", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS total, SUM(status = 'pending') AS pending, SUM(status = 'published') AS published FROM scam_reports",
    );
    const row = (
      rows as Array<{ total: number; pending: number; published: number }>
    )[0];
    const [reviewRows] = await pool.query(
      "SELECT COUNT(*) AS comments FROM admin_reviews",
    );
    const comments =
      (reviewRows as Array<{ comments: number }>)[0]?.comments ?? 0;
    return res.json({
      total: row?.published ?? 0,
      pending: row?.pending ?? 0,
      comments,
    });
  } catch {
    return res.status(503).json({ message: "Chưa kết nối được MySQL." });
  }
});
function reportSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

app.get("/api/scams/:slug", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, scammer_name AS name, amount, phone, account_number AS account, bank_name AS bank, content, reporter_name AS reporter, reporter_phone AS reporterPhone, DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS date, evidence_url AS evidence FROM scam_reports WHERE status = 'published'",
    );
    const report = (rows as Array<Record<string, unknown>>).find(
      (item) => reportSlug(String(item.name)) === req.params.slug,
    );
    return report
      ? res.json(report)
      : res.status(404).json({ message: "Không tìm thấy cảnh báo scam." });
  } catch {
    return res.status(503).json({ message: "Chưa kết nối được MySQL." });
  }
});

app.get("/api/scams", async (req, res) => {
  const query = String(req.query.q ?? "")
    .toLowerCase()
    .trim();
  try {
    const [rows] = await pool.query(
      'SELECT scammer_name AS name, CONCAT(FORMAT(amount, 0), "đ") AS amount, account_number AS account, bank_name AS bank, 0 AS views, DATE_FORMAT(created_at, "%d/%m/%Y") AS date FROM scam_reports WHERE status = "published" ORDER BY created_at DESC',
    );
    const [phoneRows] = await pool.query(
      'SELECT phone FROM scam_reports WHERE status = "published" ORDER BY created_at DESC',
    );
    const phones = phoneRows as Array<{ phone?: string }>;
    const dbRows = (rows as Array<Record<string, unknown>>).map(
      (row, index) => ({
        ...row,
        phone: phones[index]?.phone ?? "",
      }),
    );
    return res.json(
      query
        ? dbRows.filter((item) =>
            Object.values(item).some((value) =>
              String(value).toLowerCase().includes(query),
            ),
          )
        : dbRows,
    );
  } catch {
    return res.status(503).json({ message: "Chưa kết nối được MySQL." });
  }
});
app.post(
  "/api/admin-applications",
  cccdUpload.fields([
    { name: "cccdFront", maxCount: 1 },
    { name: "cccdBack", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      name,
      email,
      phone,
      services,
      websiteUrl,
      bankName,
      bankAccountNumber,
      bankAccountHolder,
      introduction,
      cccdNumber,
    } = req.body as Record<string, string>;
    const uploadedFiles = req.files as {
      cccdFront?: Express.Multer.File[];
      cccdBack?: Express.Multer.File[];
    };
    const cccdFront = uploadedFiles?.cccdFront?.[0];
    const cccdBack = uploadedFiles?.cccdBack?.[0];
    if (!cccdNumber || !/^\d{9,12}$/.test(cccdNumber))
      return res
        .status(400)
        .json({ message: "Số CCCD phải gồm 9 đến 12 chữ số." });
    if (!cccdFront || !cccdBack)
      return res
        .status(400)
        .json({ message: "Vui lòng tải đủ ảnh CCCD mặt trước và mặt sau." });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: "Email khÃ´ng há»£p lá»‡." });
    if (
      !name ||
      !email ||
      !phone ||
      !services ||
      !websiteUrl ||
      !bankName ||
      !bankAccountNumber ||
      !bankAccountHolder ||
      !introduction
    )
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin." });
    try {
      await pool.execute(
        "INSERT INTO admin_applications (name, email, phone, cccd_number, cccd_front_url, cccd_back_url, website_url, bank_name, bank_account_number, bank_account_holder, services, introduction) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          email,
          phone,
          cccdNumber,
          `/uploads/cccd/${cccdFront.filename}`,
          `/uploads/cccd/${cccdBack.filename}`,
          websiteUrl,
          bankName,
          bankAccountNumber,
          bankAccountHolder,
          services,
          introduction,
        ],
      );
      await sendStatusEmail(
        email,
        "Đã tiếp nhận đơn đăng ký admin",
        `Xin chào ${name}, chúng tôi đã nhận được đơn đăng ký admin của bạn. Đơn đang chờ kiểm duyệt.`,
      );
      return res.status(201).json({ message: "Đã gửi yêu cầu đăng ký." });
    } catch {
      return res.status(503).json({ message: "Chưa kết nối được MySQL." });
    }
  },
);

app.get("/api/admin/applications", requireAdmin, async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, website_url AS websiteUrl, bank_name AS bankName, bank_account_number AS bankAccountNumber, bank_account_holder AS bankAccountHolder, services, introduction, status, created_at AS createdAt FROM admin_applications ORDER BY created_at DESC",
    );
    return res.json(rows);
  } catch {
    return res
      .status(503)
      .json({ message: "ChÆ°a káº¿t ná»‘i Ä‘Æ°á»£c MySQL." });
  }
});

app.patch("/api/admin/applications/:id", requireAdmin, async (req, res) => {
  const status = req.body.status === "approved" ? "approved" : "rejected";
  try {
    const [rows] = await pool.query(
      "SELECT name, email FROM admin_applications WHERE id = ? LIMIT 1",
      [req.params.id],
    );
    await pool.execute(
      "UPDATE admin_applications SET status = ? WHERE id = ?",
      [status, req.params.id],
    );
    const application = (rows as Array<{ name: string; email: string }>)[0];
    await sendStatusEmail(
      application?.email,
      `Đơn đăng ký admin đã ${status === "approved" ? "được duyệt" : "bị từ chối"}`,
      `Xin chào ${application?.name ?? "bạn"}, đơn đăng ký admin của bạn ${status === "approved" ? "đã được duyệt" : "chưa được duyệt"}.`,
    );
    return res.json({ message: "Đã cập nhật trạng thái đơn.", status });
  } catch {
    return res.status(500).json({ message: "Không thể cập nhật đơn đăng ký." });
  }
});

app.post(
  "/api/reports",
  evidenceUpload.array("evidence", 10),
  async (req, res) => {
    try {
      const {
        scammerName,
        accountNumber,
        bankName,
        amount,
        phone,
        category,
        platform,
        content,
        reporterName,
        reporterPhone,
        reporterEmail,
      } = req.body;
      const evidenceFiles =
        (req.files as Express.Multer.File[] | undefined) ?? [];
      const evidenceUrl = evidenceFiles.length
        ? JSON.stringify(
            evidenceFiles.map((file) => `/uploads/evidence/${file.filename}`),
          )
        : null;
      await pool.execute(
        "INSERT INTO scam_reports (scammer_name, account_number, bank_name, amount, phone, category, platform, evidence_url, content, reporter_name, reporter_phone, reporter_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          scammerName,
          accountNumber,
          bankName,
          amount,
          phone,
          category,
          platform,
          evidenceUrl,
          content,
          reporterName,
          reporterPhone,
          reporterEmail || null,
        ],
      );
      await sendStatusEmail(
        reporterEmail,
        "Đã tiếp nhận tố cáo",
        `Tố cáo về "${scammerName}" đã được tiếp nhận và đang chờ kiểm duyệt.`,
      );
    } catch {
      /* Keep the demo form usable without a local database. */
    }
    return res.status(201).json({
      message: "Báo cáo đã được tiếp nhận và chờ kiểm duyệt.",
      report: req.body,
    });
  },
);
app.listen(Number(process.env.PORT ?? 3001), () =>
  console.log(`API running at http://localhost:${process.env.PORT ?? 3001}`),
);
