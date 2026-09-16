import { Footer } from "../components/SiteChrome";
import Icon from "../components/Icon";
export default function InfoPage({
  title,
  go,
}: {
  title: string;
  go: (path: string) => void;
}) {
  return (
    <>
      <main className="page-main container info-page">
        <span className="section-kicker">Tố Cáo Lừa Đảo</span>
        <h1>{title}</h1>
        <p className="lead">
          Tố Cáo Lừa Đảo là nền tảng cộng đồng hỗ trợ người dùng kiểm tra thông
          tin giao dịch viên, cảnh báo scam và chia sẻ kinh nghiệm mua bán
          online an toàn.
        </p>
        <div className="info-block">
          <h2>Kiểm tra trước khi giao dịch</h2>
          <p>
            Hãy tra cứu số tài khoản, số điện thoại hoặc đường link trước khi
            chuyển tiền. Khi có dấu hiệu bất thường, dừng giao dịch và gửi báo
            cáo kèm bằng chứng cho cộng đồng.
          </p>
          <button className="primary" onClick={() => go("/list/scam")}>
            Bắt đầu tra cứu <Icon name="arrow" size={17} />
          </button>
        </div>
      </main>
      <Footer go={go} />
    </>
  );
}
