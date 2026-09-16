import { FormEvent, useState } from "react";
import { Footer } from "../components/SiteChrome";
import Icon from "../components/Icon";
export default function ReportPage({ go }: { go: (path: string) => void }) {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = Array.from(
      event.currentTarget.querySelectorAll(
        "input:not([type=file]):not([type=checkbox]), textarea",
      ),
    ).map((field) => (field as HTMLInputElement | HTMLTextAreaElement).value);
    localStorage.setItem(
      "lastReport",
      JSON.stringify({
        scammer: fields[0],
        content: fields[5],
        reporter: fields[7],
        reporterPhone: fields[8],
        createdAt: new Date().toLocaleString("vi-VN"),
      }),
    );
    setSent(true);
  };
  return (
    <>
      <main className="page-main container report-page">
        <div className="page-intro">
          <span className="section-kicker">Bảo vệ cộng đồng</span>
          <h1>Gửi tố cáo scam</h1>
          <p>
            Chia sẻ thông tin và bằng chứng để giúp người khác tránh rủi ro khi
            giao dịch online.
          </p>
        </div>
        {sent ? (
          <div className="success-box">
            <div className="success-icon">
              <Icon name="check" size={28} />
            </div>
            <h2>Đã tiếp nhận tố cáo</h2>
            <p>Báo cáo của bạn đã được ghi nhận để kiểm duyệt.</p>
            <button className="primary" onClick={() => go("/")}>
              Về trang chủ
            </button>
          </div>
        ) : (
          <form className="report-form" onSubmit={submit}>
            <div className="form-section">
              <h2>Thông tin đối tượng</h2>
              <div className="form-grid">
                <label>
                  Tên người lừa đảo *
                  <input required placeholder="Nguyễn Văn A" />
                </label>
                <label>
                  Số tài khoản lừa đảo *<input required />
                </label>
                <label>
                  Ngân hàng *<input required placeholder="Tên ngân hàng" />
                </label>
                <label>
                  Số tiền chiếm đoạt *
                  <input required type="number" placeholder="0" />
                </label>
                <label>
                  Số điện thoại
                  <input placeholder="0xxxx" />
                </label>
                <label>
                  Danh mục *
                  <input
                    required
                    placeholder="Giao dịch game, mạng xã hội..."
                  />
                </label>
              </div>
            </div>
            <div className="form-section">
              <h2>Nội dung tố cáo</h2>
              <label>
                Nội dung chi tiết *
                <textarea
                  required
                  rows={6}
                  placeholder="Mô tả diễn biến sự việc..."
                ></textarea>
              </label>
              <div className="upload">
                <Icon name="flag" size={24} />
                <span>
                  <b>Tải lên bill hoặc ảnh đoạn chat</b>
                  <small>PNG, JPG tối đa 10MB · Có thể chọn nhiều ảnh</small>
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  multiple
                  aria-label="Tải lên ảnh bằng chứng"
                />
              </div>
            </div>
            <div className="form-section">
              <h2>Người tố cáo</h2>
              <div className="form-grid">
                <label>
                  Họ và tên *<input required placeholder="Nhập họ tên bạn" />
                </label>
                <label>
                  Số điện thoại *
                  <input required placeholder="Nhập số điện thoại của bạn" />
                </label>
              </div>
              <label className="check-row">
                <input type="checkbox" required /> Tôi đồng ý chịu trách nhiệm
                về nội dung tố cáo.
              </label>
              <button className="primary submit-btn">
                Gửi duyệt <Icon name="arrow" size={17} />
              </button>
            </div>
          </form>
        )}
      </main>
      <Footer go={go} />
    </>
  );
}
