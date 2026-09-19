import Icon from "../components/Icon";
import { Footer } from "../components/SiteChrome";

const steps = [
  {
    number: "01",
    title: "Chọn giao dịch viên",
    text: "Xem hồ sơ, dịch vụ và thông tin xác minh của giao dịch viên phù hợp.",
  },
  {
    number: "02",
    title: "Gửi thông tin giao dịch",
    text: "Hai bên thống nhất nội dung, giá trị và các điều kiện giao dịch rõ ràng.",
  },
  {
    number: "03",
    title: "Xác nhận trung gian",
    text: "Giao dịch viên kiểm tra thông tin và thông báo các bước cần thực hiện.",
  },
  {
    number: "04",
    title: "Hoàn tất an toàn",
    text: "Chỉ chuyển giao tài sản khi các bên đã xác nhận đúng thỏa thuận.",
  },
];

export default function MiddlemanProcessPage({
  go,
}: {
  go: (path: string) => void;
}) {
  return (
    <>
      <main className="process-page">
        <section className="process-hero">
          <div className="container">
            <button
              className="back-link"
              onClick={() => go("/list/category/admin/gd-trung-gian")}
            >
              ← Quay lại giao dịch trung gian
            </button>
            <span className="section-kicker">Quy trình minh bạch</span>
            <h1>Giao dịch trung gian an toàn hơn</h1>
            <p>
              Làm theo các bước dưới đây để giảm rủi ro và luôn kiểm tra thông
              tin trước khi chuyển tiền hoặc bàn giao tài sản.
            </p>
          </div>
        </section>
        <section className="container process-content">
          <div className="process-intro-card">
            <div className="process-icon">
              <Icon name="shield" size={32} />
            </div>
            <div>
              <h2>Trung gian là gì?</h2>
              <p>
                Giao dịch viên trung gian đứng giữa người mua và người bán để
                xác nhận thông tin, giữ quy trình minh bạch và hỗ trợ xử lý khi
                có vấn đề.
              </p>
            </div>
          </div>
          <div className="process-steps">
            {steps.map((step) => (
              <article className="process-step" key={step.number}>
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="process-warning">
            <Icon name="alert" size={20} />
            <p>
              Không chuyển tiền nếu chưa xác minh đúng tên, số điện thoại và
              thông tin của giao dịch viên. Tố cáo ngay khi phát hiện dấu hiệu
              bất thường.
            </p>
          </div>
          <div className="process-actions">
            <button
              className="primary"
              onClick={() => go("/list/category/admin/gd-trung-gian")}
            >
              Chọn giao dịch viên <Icon name="arrow" size={16} />
            </button>
            <button className="text-btn" onClick={() => go("/report/scam")}>
              Báo cáo dấu hiệu scam <Icon name="arrow" size={16} />
            </button>
          </div>
        </section>
      </main>
      <Footer go={go} />
    </>
  );
}
