import { FormEvent, useEffect, useState } from "react";
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
    cccdNumber: "",
    services: "",
    websiteUrl: "",
    bankName: "",
    bankAccountNumber: "",
    bankAccountHolder: "",
    introduction: "",
  });
  const [cccdFront, setCccdFront] = useState<File | null>(null);
  const [cccdBack, setCccdBack] = useState<File | null>(null);
  const [cccdFrontPreview, setCccdFrontPreview] = useState("");
  const [cccdBackPreview, setCccdBackPreview] = useState("");
  useEffect(
    () => () => {
      if (cccdFrontPreview) URL.revokeObjectURL(cccdFrontPreview);
      if (cccdBackPreview) URL.revokeObjectURL(cccdBackPreview);
    },
    [cccdFrontPreview, cccdBackPreview],
  );
  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        payload.append(key, value),
      );
      if (cccdFront) payload.append("cccdFront", cccdFront);
      if (cccdBack) payload.append("cccdBack", cccdBack);
      const response = await fetch(
        "http://localhost:3001/api/admin-applications",
        {
          method: "POST",
          body: payload,
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
                <label>
                  Số CCCD
                  <input
                    required
                    inputMode="numeric"
                    pattern="[0-9]{9,12}"
                    placeholder="Nhập 9–12 chữ số"
                    value={form.cccdNumber}
                    onChange={(e) => update("cccdNumber", e.target.value)}
                  />
                </label>
                <label>
                  URL liên hệ / website
                  <input
                    required
                    type="url"
                    placeholder="https://facebook.com/ten-cua-ban"
                    value={form.websiteUrl}
                    onChange={(e) => update("websiteUrl", e.target.value)}
                  />
                </label>
              </div>
              <div className="identity-upload-grid">
                <div className="identity-upload">
                  <label className="identity-upload-title" htmlFor="cccd-front">
                    Ảnh CCCD mặt trước *
                  </label>
                  {cccdFrontPreview && (
                    <img
                      src={cccdFrontPreview}
                      alt="Xem trước CCCD mặt trước"
                    />
                  )}
                  <div className="identity-file-row">
                    <input
                      id="cccd-front"
                      className="identity-file-input"
                      required
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setCccdFront(file);
                        setCccdFrontPreview(
                          file ? URL.createObjectURL(file) : "",
                        );
                      }}
                    />
                    <label
                      className="identity-file-button"
                      htmlFor="cccd-front"
                    >
                      Choose File
                    </label>
                    <span className="identity-file-name">
                      {cccdFront?.name ?? "Chưa chọn ảnh"}
                    </span>
                  </div>
                  {!cccdFront && (
                    <small>PNG, JPG hoặc WEBP · tối đa 10MB</small>
                  )}
                </div>
                <div className="identity-upload">
                  <label className="identity-upload-title" htmlFor="cccd-back">
                    Ảnh CCCD mặt sau *
                  </label>
                  {cccdBackPreview && (
                    <img src={cccdBackPreview} alt="Xem trước CCCD mặt sau" />
                  )}
                  <div className="identity-file-row">
                    <input
                      id="cccd-back"
                      className="identity-file-input"
                      required
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setCccdBack(file);
                        setCccdBackPreview(
                          file ? URL.createObjectURL(file) : "",
                        );
                      }}
                    />
                    <label className="identity-file-button" htmlFor="cccd-back">
                      Choose File
                    </label>
                    <span className="identity-file-name">
                      {cccdBack?.name ?? "Chưa chọn ảnh"}
                    </span>
                  </div>
                  {!cccdBack && <small>PNG, JPG hoặc WEBP · tối đa 10MB</small>}
                </div>
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
              <h2 className="registration-subheading">Tài khoản ngân hàng</h2>
              <div className="form-grid">
                <label>
                  Ngân hàng
                  <input
                    required
                    placeholder="Ví dụ: MB Bank, VPBank"
                    value={form.bankName}
                    onChange={(e) => update("bankName", e.target.value)}
                  />
                </label>
                <label>
                  Số tài khoản
                  <input
                    required
                    inputMode="numeric"
                    value={form.bankAccountNumber}
                    onChange={(e) =>
                      update("bankAccountNumber", e.target.value)
                    }
                  />
                </label>
                <label>
                  Tên chủ tài khoản
                  <input
                    required
                    value={form.bankAccountHolder}
                    onChange={(e) =>
                      update("bankAccountHolder", e.target.value)
                    }
                  />
                </label>
              </div>
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
