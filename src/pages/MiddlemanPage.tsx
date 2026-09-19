import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { Footer } from "../components/SiteChrome";

type Middleman = {
  id: number;
  name: string;
  slug: string;
  avatarUrl?: string;
  category?: string;
};

export default function MiddlemanPage({ go }: { go: (path: string) => void }) {
  const [admins, setAdmins] = useState<Middleman[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/api/admins?category=gd-trung-gian")
      .then((response) => response.json())
      .then((data) => setAdmins(Array.isArray(data) ? data : []))
      .catch(() => setAdmins([]))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <>
      <main className="middleman-page">
        <section className="middleman-hero">
          <div className="container middleman-hero-grid">
            <div>
              <span className="section-kicker">Dịch vụ an toàn</span>
              <h1>Giao dịch trung gian</h1>
              <p>
                Chọn một giao dịch viên trung gian uy tín để bảo vệ giao dịch
                của bạn từ lúc bắt đầu đến khi hoàn tất.
              </p>
              <button
                className="primary"
                onClick={() => go("/middleman/process")}
              >
                <Icon name="shield" size={16} /> Tìm hiểu quy trình
              </button>
            </div>
            <div className="middleman-hero-card">
              <Icon name="shield" size={46} />
              <strong>Bảo vệ giao dịch</strong>
              <span>Đối soát rõ ràng · Hỗ trợ nhanh · Minh bạch</span>
            </div>
          </div>
        </section>

        <section className="container middleman-content">
          <div className="middleman-heading">
            <div>
              <span className="section-kicker">Danh sách đã xác minh</span>
              <h2>Giao dịch viên trung gian</h2>
            </div>
            <button className="outline-btn" onClick={() => go("/list/admin")}>
              Xem tất cả admin <Icon name="arrow" size={16} />
            </button>
          </div>
          {!loaded && (
            <div className="empty-list">Đang tải giao dịch viên...</div>
          )}
          {loaded && admins.length === 0 && (
            <div className="empty-list">Chưa có giao dịch viên trung gian.</div>
          )}
          <div className="middleman-grid">
            {admins.map((admin) => (
              <article
                className="middleman-card"
                key={admin.id}
                role="button"
                tabIndex={0}
                onClick={() => go(`/admin/${admin.slug}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ")
                    go(`/admin/${admin.slug}`);
                }}
              >
                <div className="middleman-avatar">
                  {admin.avatarUrl ? (
                    <img src={admin.avatarUrl} alt={admin.name} />
                  ) : (
                    admin.name
                      .split(" ")
                      .filter(Boolean)
                      .map((part) => part[0])
                      .join("")
                  )}
                </div>
                <div className="middleman-card-copy">
                  <span className="verified">
                    <Icon name="check" size={13} /> Đã xác thực
                  </span>
                  <h3>{admin.name}</h3>
                  <p>Nhận giao dịch trung gian</p>
                </div>
                <Icon name="arrow" size={18} />
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer go={go} />
    </>
  );
}
