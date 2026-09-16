import Icon from "../components/Icon";
import { Footer } from "../components/SiteChrome";
import { scamRows, slugify } from "../data/scams";
export default function ScamDetailPage({
  slug,
  go,
}: {
  slug: string;
  go: (path: string) => void;
}) {
  const row = scamRows.find((item) => slugify(item[0]) === slug) ?? scamRows[0];
  let report: {
    scammer?: string;
    reporter?: string;
    reporterPhone?: string;
    content?: string;
    createdAt?: string;
    evidence?: string[];
  } | null = null;
  try {
    const saved = JSON.parse(localStorage.getItem("lastReport") ?? "null");
    if (saved && slugify(saved.scammer ?? "") === slug) report = saved;
  } catch {}
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
                <small>Cập nhật {row[6]}</small>
              </div>
              <h1>{row[0]}</h1>
              <p className="detail-subtitle">
                Thông tin được cộng đồng ghi nhận và cảnh báo trước khi giao
                dịch.
              </p>
              <div className="detail-items">
                <div>
                  <span>Chủ tài khoản</span>
                  <b>{row[0]}</b>
                </div>
                <div>
                  <span>Số điện thoại</span>
                  <b>{row[2]}</b>
                </div>
                <div>
                  <span>Số tài khoản</span>
                  <b>{row[3]}</b>
                </div>
                <div>
                  <span>Ngân hàng</span>
                  <b>{row[4]}</b>
                </div>
                <div>
                  <span>Số tiền chiếm đoạt</span>
                  <b className="detail-amount">{row[1]}</b>
                </div>
                <div>
                  <span>Lượt xem</span>
                  <b>{row[5]} lượt xem</b>
                </div>
              </div>
            </div>
            <div className="detail-card evidence-card">
              <h2>Nội dung tố cáo</h2>
              <p>
                {report?.content ||
                  "Hồ sơ này được đăng tải để cộng đồng chủ động kiểm tra trước khi chuyển tiền. Hãy đối chiếu đầy đủ số điện thoại, số tài khoản và tên người nhận trước mọi giao dịch."}
              </p>
              {report && (
                <div className="reporter-meta">
                  <div>
                    <span>Người tố cáo</span>
                    <b>{report.reporter}</b>
                  </div>
                  <div>
                    <span>Số điện thoại người tố cáo</span>
                    <b>{report.reporterPhone}</b>
                  </div>
                  <div>
                    <span>Ngày giờ gửi tố cáo</span>
                    <b>{report.createdAt}</b>
                  </div>
                </div>
              )}
              {report?.evidence?.length ? (
                <div className="detail-evidence">
                  <h3>Ảnh bằng chứng</h3>
                  <div className="detail-evidence-grid">
                    {report.evidence.map((image, index) => (
                      <img
                        key={image.slice(-30)}
                        src={image}
                        alt={`Bằng chứng ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="warning-box">
                <Icon name="shield" size={20} />
                <span>
                  Không chuyển tiền nếu thông tin người nhận không trùng khớp
                  hoặc đối phương thúc giục giao dịch.
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
