import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { Footer } from "../components/SiteChrome";
import { slugify } from "../data/scams";
type ScamItem = {
  name: string;
  amount: string;
  phone?: string;
  account: string;
  bank: string;
  views: number | string;
  date: string;
};
const assets = [
  "image_56771365.png",
  "image_27055372.jpg",
  "image_81388629.png",
  "image_69683321.png",
  "image_13920872.jpg",
  "image_28131030.png",
  "image_12068156.jpg",
  "image_38280786.jfif",
  "image_73597256.jpg",
  "image_66794864.jfif",
  "image_91309885.jpg",
  "image_68348443.png",
  "image_87051155.png",
  "image_17376650.jfif",
  "image_73623863.png",
  "image_93395952.jpg",
  "image_35402790.jfif",
  "image_72021952.png",
  "image_65071586.png",
];
const names = [
  "GD trung gian",
  "Dịch vụ Game",
  "Dịch vụ FB",
  "Dịch vụ Tiktok",
  "Phần mềm",
  "Tài nguyên ADS",
  "Dịch vụ MXH",
  "Rút VTS",
  "Liên Quân",
  "Freefire",
  "FC Mobile",
  "Roblox",
  "PUBG",
  "TFT",
  "Valorant",
  "Đột Kích",
  "FIFA Online 4",
  "LOL",
  "Thiết Kế WEB",
];
function Table({ go, rows }: { go: (path: string) => void; rows: ScamItem[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Người bị tố cáo</th>
            <th>Số tiền</th>
            <th>SĐT</th>
            <th>STK</th>
            <th>Ngân hàng</th>
            <th>Lượt xem</th>
            <th>Ngày</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 5).map((row) => (
            <tr key={`${row.name}-${row.account}`}>
              <td>
                <b>
                  <span className="person-mark">●</span>
                  <button
                    className="scam-name"
                    onClick={() => go(`/scam/${slugify(row.name)}`)}
                  >
                    {row.name}
                  </button>
                </b>
              </td>
              <td className="amount">{row.amount}</td>
              <td className="mono">{row.phone || "—"}</td>
              <td className="mono">{row.account}</td>
              <td>
                <span className="bank">{row.bank}</span>
              </td>
              <td>{row.views} lượt xem</td>
              <td>{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default function HomePage({ go }: { go: (path: string) => void }) {
  const [dbCategories, setDbCategories] = useState<
    Array<{ id: number; name: string; slug: string; imageUrl: string | null }>
  >([]);
  const [scams, setScams] = useState<ScamItem[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, comments: 0 });
  useEffect(() => {
    fetch("http://localhost:3001/api/categories")
      .then((response) => response.json())
      .then(setDbCategories)
      .catch(() => {});
    fetch("http://localhost:3001/api/scams")
      .then((response) => response.json())
      .then((data) => setScams(Array.isArray(data) ? data : []))
      .catch(() => setScams([]));
    fetch("http://localhost:3001/api/stats")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);
  const categoryItems = dbCategories;
  return (
    <>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="live-dot" /> Cộng đồng giao dịch an toàn
              </div>
              <h1>
                Kiểm tra trước.
                <br />
                <em>Giao dịch an tâm.</em>
              </h1>
              <p>
                Tra cứu nhanh số điện thoại, tài khoản ngân hàng, website và
                fanpage để nhận biết rủi ro trước khi chuyển tiền.
              </p>
              <form
                className="search-box"
                onSubmit={(e) => {
                  e.preventDefault();
                  go("/list/scam");
                }}
              >
                <Icon name="search" size={22} />
                <input
                  placeholder="Nhập SĐT, email, số tài khoản, website..."
                  aria-label="Thông tin cần tra cứu"
                />
                <button>Tra cứu</button>
              </form>
              <div className="hero-actions">
                <button className="primary" onClick={() => go("/report/scam")}>
                  Gửi tố cáo scam <Icon name="arrow" size={17} />
                </button>
                <button className="text-btn" onClick={() => go("/list/admin")}>
                  Tìm giao dịch viên uy tín <Icon name="arrow" size={16} />
                </button>
              </div>
            </div>
            <div className="hero-art">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="shield-art">
                <Icon name="shield" size={88} />
              </div>
            </div>
          </div>
        </section>
        <section className="container">
          <div className="stats">
            <div>
              <strong>{stats.total}</strong>
              <span>Tài khoản cảnh báo</span>
            </div>
            <div>
              <strong>{stats.total}</strong>
              <span>Hồ sơ lừa đảo</span>
            </div>
            <div>
              <strong>{stats.comments}</strong>
              <span>Bình luận cộng đồng</span>
            </div>
            <div>
              <strong>{String(stats.pending).padStart(2, "0")}</strong>
              <span>Tố cáo chờ duyệt</span>
            </div>
          </div>
        </section>
        <section className="section container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Cảnh báo mới nhất</span>
              <h2>Cộng đồng đang theo dõi</h2>
            </div>
            <button className="outline-btn" onClick={() => go("/list/scam")}>
              Xem tất cả <Icon name="arrow" size={16} />
            </button>
          </div>
          <Table go={go} rows={scams} />
        </section>
        <section className="category-showcase">
          <div className="container">
            <div className="center-heading">
              <span className="section-kicker">Khám phá danh mục</span>
              <h2>Top giao dịch viên</h2>
              <p>
                Chọn đúng danh mục để tìm người hỗ trợ phù hợp với giao dịch của
                bạn.
              </p>
            </div>
            <div className="category-grid">
              {categoryItems.map((category) => (
                <button
                  className="category-tile"
                  key={category.id}
                  onClick={() => go(`/list/category/admin/${category.slug}`)}
                >
                  <img
                    src={category.imageUrl || ""}
                    alt={category.name}
                    loading="lazy"
                  />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="trust-strip">
          <div className="container trust-grid">
            <div>
              <Icon name="shield" size={26} />
              <span>
                <b>Kiểm tra miễn phí</b>
                <small>Thông tin minh bạch từ cộng đồng</small>
              </span>
            </div>
            <div>
              <Icon name="users" size={26} />
              <span>
                <b>Cùng nhau cảnh giác</b>
                <small>Mỗi báo cáo giúp bảo vệ thêm người</small>
              </span>
            </div>
            <div>
              <Icon name="check" size={26} />
              <span>
                <b>Dữ liệu được kiểm duyệt</b>
                <small>Ưu tiên bằng chứng xác thực</small>
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer go={go} />
    </>
  );
}
