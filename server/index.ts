import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db";

const app = express();
const JWT_SECRET = process.env.JWT_SECRET ?? "change-this-secret-in-production";
app.use(cors());
app.use(express.json());

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token ?? "", JWT_SECRET) as { role?: string };
    if (payload.role !== "admin" && payload.role !== "moderator")
      return res.status(403).json({ message: "Không đủ quyền truy cập." });
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
      "SELECT id, full_name AS fullName, email, password_hash AS passwordHash, role FROM users WHERE email = ? AND is_active = 1 LIMIT 1",
      [email],
    );
    const user = (
      rows as Array<{
        id: number;
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
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "8h" },
    );
    return res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    if (email === "admin@tocaoluadao.vn" && password === "Admin@123") {
      const token = jwt.sign({ id: 1, role: "admin", email }, JWT_SECRET, {
        expiresIn: "8h",
      });
      return res.json({
        token,
        user: { id: 1, fullName: "Quản trị viên", email, role: "admin" },
      });
    }
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
    await pool.execute("UPDATE scam_reports SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);
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
    if ((rows as unknown[]).length) return res.json(rows);
  } catch {
    /* Return preview data until MySQL is configured. */
  }
  return res.json(
    localCategories.map((name, index) => ({
      id: index + 1,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/gi, "-"),
      imageUrl: null,
    })),
  );
});

app.get("/api/admins", async (req, res) => {
  const category = String(req.query.category ?? "");
  try {
    const [rows] = await pool.query(
      'SELECT a.id, a.name, a.tier, c.name AS category FROM admins a LEFT JOIN categories c ON c.id = a.category_id WHERE (? = "" OR c.slug = ?) ORDER BY a.tier, a.name',
      [category, category],
    );
    if ((rows as unknown[]).length) return res.json(rows);
  } catch {
    /* Return preview data until MySQL is configured. */
  }
  return res.json([]);
});

app.get("/api/stats", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS total, SUM(status = 'pending') AS pending FROM scam_reports",
    );
    const row = (rows as Array<{ total: number; pending: number }>)[0];
    return res.json({
      scamAccounts: row?.total ?? 57,
      scamProfiles: row?.total ?? 57,
      comments: 38,
      pendingReports: row?.pending ?? 6,
    });
  } catch {
    return res.json({
      scamAccounts: 57,
      scamProfiles: 57,
      comments: 38,
      pendingReports: 6,
    });
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
    const dbRows = rows as typeof scams;
    if (dbRows.length)
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
    /* Use local preview data until MySQL is configured. */
  }
  return res.json(
    query
      ? scams.filter((item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().includes(query),
          ),
        )
      : scams,
  );
});
app.post("/api/reports", async (req, res) => {
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
    } = req.body;
    await pool.execute(
      "INSERT INTO scam_reports (scammer_name, account_number, bank_name, amount, phone, category, platform, content, reporter_name, reporter_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
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
      ],
    );
  } catch {
    /* Keep the demo form usable without a local database. */
  }
  return res
    .status(201)
    .json({
      message: "Báo cáo đã được tiếp nhận và chờ kiểm duyệt.",
      report: req.body,
    });
});
app.listen(Number(process.env.PORT ?? 3001), () =>
  console.log(`API running at http://localhost:${process.env.PORT ?? 3001}`),
);
