import { FormEvent, useState } from "react";
import Icon from "../components/Icon";
import { Footer } from "../components/SiteChrome";

export default function AdminRegistrationPage({
  go,
}: {
  go: (path: string) => void;
}) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    services: "",
    introduction: "",
  });
  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch(
        "http://localhost:3001/api/admin-applications",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      if (!response.ok) throw new Error("Không thể gửi yêu cầu đăng ký.");
      setSent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Có lỗi xảy ra.");
    }
  };
  return (
    <>
      <main className="page-main container registration-page">
        <button
          className="back-link"
          onClick={() => go("/news/tham-gia-bao-hiem")}
        >
          ← Quay lại điều kiện đăng ký
        </button>
        <div className="page-intro">
          <span className="section-kicker">Tham gia cộng đồng</span>
          <h1>Đăng ký trở thành admin</h1>
          <p>
            Gửi thông tin để đội ngũ kiểm duyệt xác minh và tạo hồ sơ giao dịch
            viên cho bạn.
          </p>
        </div>
        {sent ? (
          <div className="success-box">
            <div className="success-icon">
              <Icon name="check" size={27} />
            </div>
            <h2>Đã nhận yêu cầu đăng ký</h2>
            <p>
              Thông tin của bạn đã được gửi. Đội ngũ sẽ liên hệ sau khi hoàn tất
              kiểm duyệt.
            </p>
            <button className="primary" onClick={() => go("/list/admin")}>
              Xem danh sách admin <Icon name="arrow" size={16} />
            </button>
          </div>
        ) : (
          <form className="registration-form" onSubmit={submit}>
            <div className="form-section">
              <h2>Thông tin liên hệ</h2>
              <div className="form-grid">
                <label>
                  Họ và tên
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </label>
                <label>
                  Email
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </label>
                <label>
                  Số điện thoại
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </label>
                <label>
                  Dịch vụ cung cấp
                  <input
                    required
                    placeholder="Ví dụ: Game, Facebook, Tiktok"
                    value={form.services}
                    onChange={(e) => update("services", e.target.value)}
                  />
                </label>
              </div>
              <label>
                Giới thiệu
                <textarea
                  required
                  rows={5}
                  value={form.introduction}
                  onChange={(e) => update("introduction", e.target.value)}
                  placeholder="Mô tả kinh nghiệm và cách bạn hỗ trợ giao dịch..."
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="primary submit-btn" type="submit">
                Gửi yêu cầu đăng ký <Icon name="arrow" size={16} />
              </button>
            </div>
          </form>
        )}
      </main>
      <Footer go={go} />
    </>
  );
}
