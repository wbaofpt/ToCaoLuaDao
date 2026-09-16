import { FormEvent, useEffect, useState } from "react";
import Icon from "../components/Icon";
import { Footer } from "../components/SiteChrome";

type User = { fullName: string; email: string; role: string };
type Report = {
  id: number;
  scammerName: string;
  reporterName: string;
  reporterPhone: string;
  amount: number;
  status: string;
  createdAt: string;
};

export function AdminLoginPage({ go }: { go: (path: string) => void }) {
  const [email, setEmail] = useState("admin@tocaoluadao.vn");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      go("/admin");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Đăng nhập thất bại.",
      );
    }
  };
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Icon name="shield" size={25} />
        </div>
        <span className="section-kicker">Khu vực quản trị</span>
        <h1>Đăng nhập admin</h1>
        <p>Quản lý tố cáo và kiểm duyệt nội dung cộng đồng.</p>
        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Mật khẩu
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary auth-submit">
            Đăng nhập <Icon name="arrow" size={16} />
          </button>
        </form>
        <small className="demo-hint">
          Tài khoản demo: admin@tocaoluadao.vn · Admin@123
        </small>
      </div>
    </main>
  );
}

export default function AdminPage({ go }: { go: (path: string) => void }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const token = localStorage.getItem("adminToken");
  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("adminUser") ?? "null"));
    } catch {}
    if (token)
      fetch("http://localhost:3001/api/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then(setReports)
        .catch(() => {});
  }, [token]);
  const update = async (id: number, status: "published" | "rejected") => {
    await fetch(`http://localhost:3001/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    setReports((items) =>
      items.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };
  if (!token) {
    go("/admin/login");
    return null;
  }
  return (
    <>
      <main className="admin-dashboard">
        <div className="admin-topbar">
          <div>
            <span className="section-kicker">Bảng điều khiển</span>
            <h1>Xin chào, {user?.fullName ?? "Admin"}</h1>
          </div>
          <button
            className="outline-btn"
            onClick={() => {
              localStorage.removeItem("adminToken");
              localStorage.removeItem("adminUser");
              go("/admin/login");
            }}
          >
            Đăng xuất
          </button>
        </div>
        <div className="admin-stat-grid">
          <div>
            <strong>{reports.length}</strong>
            <span>Tổng tố cáo</span>
          </div>
          <div>
            <strong>
              {reports.filter((report) => report.status === "pending").length}
            </strong>
            <span>Chờ kiểm duyệt</span>
          </div>
          <div>
            <strong>
              {reports.filter((report) => report.status === "published").length}
            </strong>
            <span>Đã công khai</span>
          </div>
        </div>
        <section className="admin-panel">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Kiểm duyệt</span>
              <h2>Danh sách tố cáo</h2>
            </div>
            <button className="text-btn" onClick={() => go("/")}>
              Xem website <Icon name="arrow" size={16} />
            </button>
          </div>
          {reports.length ? (
            <div className="admin-report-list">
              {reports.map((report) => (
                <article key={report.id} className="admin-report">
                  <div>
                    <span className={`status status-${report.status}`}>
                      {report.status === "pending"
                        ? "Chờ duyệt"
                        : report.status === "published"
                          ? "Đã công khai"
                          : "Đã từ chối"}
                    </span>
                    <h3>{report.scammerName}</h3>
                    <p>
                      Người tố cáo: {report.reporterName} ·{" "}
                      {report.reporterPhone}
                    </p>
                  </div>
                  <div className="admin-report-actions">
                    {report.status === "pending" && (
                      <>
                        <button
                          className="approve"
                          onClick={() => update(report.id, "published")}
                        >
                          <Icon name="check" size={15} /> Duyệt
                        </button>
                        <button
                          className="reject"
                          onClick={() => update(report.id, "rejected")}
                        >
                          <Icon name="x" size={15} /> Từ chối
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty">
              <Icon name="check" size={24} />
              <h3>Chưa có tố cáo</h3>
              <p>Các báo cáo mới sẽ xuất hiện tại đây để admin kiểm duyệt.</p>
            </div>
          )}
        </section>
      </main>
      <Footer go={go} />
    </>
  );
}
