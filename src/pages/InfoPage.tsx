import { Footer } from "../components/SiteChrome";
import Icon from "../components/Icon";
export default function InfoPage({
  title,
  go,
  registration = false,
}: {
  title: string;
  go: (path: string) => void;
  registration?: boolean;
}) {
  return (
    <>
      <main className="page-main container info-page">
        <span className="section-kicker">Tố Cáo Lừa Đảo</span>
        <h1>{title}</h1>
        <p className="lead">
          {registration
            ? "Đăng ký trở thành giao dịch viên được xác minh và kết nối với cộng đồng giao dịch an toàn."
            : "Tố Cáo Lừa Đảo là nền tảng cộng đồng hỗ trợ người dùng kiểm tra thông tin giao dịch viên và cảnh báo scam."}
        </p>
        <div className="info-block">
          <h2>
            {registration
              ? "Điều kiện đăng ký admin"
              : "Kiểm tra trước khi giao dịch"}
          </h2>
          {registration ? (
            <>
              <p>
                Admin cần cung cấp thông tin cá nhân chính xác, kênh liên hệ,
                dịch vụ đang cung cấp và cam kết hỗ trợ giao dịch minh bạch.
              </p>
              <ul className="info-list">
                <li>
                  Có lịch sử giao dịch rõ ràng và thông tin liên hệ xác thực.
                </li>
                <li>
                  Cung cấp đầy đủ danh mục dịch vụ, ngân hàng và khu vực hỗ trợ.
                </li>
                <li>
                  Tuân thủ quy định cộng đồng, không nhận tiền hoặc tài sản bất
                  hợp pháp.
                </li>
              </ul>
              <button className="primary" onClick={() => go("/admin/register")}>
                Gửi yêu cầu đăng ký <Icon name="arrow" size={17} />
              </button>
            </>
          ) : (
            <>
              <p>
                Hãy tra cứu số tài khoản, số điện thoại hoặc đường link trước
                khi chuyển tiền.
              </p>
              <button className="primary" onClick={() => go("/list/scam")}>
                Bắt đầu tra cứu <Icon name="arrow" size={17} />
              </button>
            </>
          )}
        </div>
      </main>
      <Footer go={go} />
    </>
  );
}
