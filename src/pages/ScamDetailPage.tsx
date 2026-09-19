import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { Footer } from "../components/SiteChrome";

type ScamReport = {
  name: string;
  amount: string | number;
  phone?: string;
  account: string;
  bank: string;
  reporter?: string;
  reporterPhone?: string;
  content?: string;
  date?: string;
  evidence?: string;
};

export default function ScamDetailPage({
  slug,
  go,
}: {
  slug: string;
  go: (path: string) => void;
}) {
  const [report, setReport] = useState<ScamReport | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`http://localhost:3001/api/scams/${slug}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setReport(data);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [slug]);
  if (error)
    return (
      <main className="admin-profile-loading">
        <h1>Không tìm thấy cảnh báo scam</h1>
        <p>{error}</p>
        <button className="primary" onClick={() => go("/list/scam")}>
          Quay lại danh sách
        </button>
      </main>
    );
  if (!report)
    return <main className="admin-profile-loading">Đang tải cảnh báo...</main>;
  return (
    <>
      <main className="page-main container detail-page">
        <button className="back-link" onClick={() => go("/list/scam")}>
          ← Quay lại danh sách scam
        </button>
        <div className="detail-layout">
          <section>
            <div className="detail-card">
              <div className="detail-card-header">
                <span className="danger-badge">
                  <Icon name="flag" size={15} /> Cảnh báo scam
                </span>
                <small>Cập nhật {report.date || "—"}</small>
              </div>
              <h1>{report.name}</h1>
              <p className="detail-subtitle">
                Thông tin được cộng đồng ghi nhận và cảnh báo trước khi giao
                dịch.
              </p>
              <div className="detail-items">
                <div>
                  <span>Chủ tài khoản</span>
                  <b>{report.name}</b>
                </div>
                <div>
                  <span>Số điện thoại</span>
                  <b>{report.phone || "Chưa cập nhật"}</b>
                </div>
                <div>
                  <span>Số tài khoản</span>
                  <b>{report.account}</b>
                </div>
                <div>
                  <span>Ngân hàng</span>
                  <b>{report.bank}</b>
                </div>
                <div>
                  <span>Số tiền chiếm đoạt</span>
                  <b className="detail-amount">
                    {Number(report.amount).toLocaleString("vi-VN")}đ
                  </b>
                </div>
                <div>
                  <span>Người tố cáo</span>
                  <b>{report.reporter || "Ẩn danh"}</b>
                </div>
              </div>
            </div>
            <div className="detail-card evidence-card">
              <h2>Nội dung tố cáo</h2>
              <p>{report.content || "Chưa có nội dung tố cáo."}</p>
              {report.reporterPhone && (
                <div className="reporter-meta">
                  <div>
                    <span>Số điện thoại người tố cáo</span>
                    <b>{report.reporterPhone}</b>
                  </div>
                  <div>
                    <span>Ngày giờ gửi tố cáo</span>
                    <b>{report.date}</b>
                  </div>
                </div>
              )}
              {report.evidence && (
                <div className="detail-evidence">
                  <h3>Ảnh bằng chứng</h3>
                  <div className="detail-evidence-grid">
                    <img src={report.evidence} alt="Bằng chứng tố cáo" />
                  </div>
                </div>
              )}
              <div className="warning-box">
                <Icon name="shield" size={20} />
                <span>
                  Không chuyển tiền nếu thông tin người nhận không trùng khớp
                  hoặc có dấu hiệu thúc giục giao dịch.
                </span>
              </div>
            </div>
          </section>
          <aside className="detail-aside">
            <div className="aside-icon">
              <Icon name="shield" size={27} />
            </div>
            <h2>Giao dịch cẩn trọng</h2>
            <p>Hãy tự xác minh thêm bằng chứng trước khi đưa ra quyết định.</p>
            <button className="primary" onClick={() => go("/report/scam")}>
              Báo cáo bổ sung <Icon name="arrow" size={16} />
            </button>
          </aside>
        </div>
      </main>
      <Footer go={go} />
    </>
  );
}
