import { FormEvent, useState } from "react";
import Icon from "../../components/Icon";
export default function AdminLoginPage({ go }: { go: (path: string) => void }) {
  const [email, setEmail] = useState("admin@tocaoluadao.vn");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
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
      go("/admin/dashboard");
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
        <p>Quản lý hồ sơ và thông tin giao dịch viên của bạn.</p>
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
