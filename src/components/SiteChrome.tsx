import { useState } from "react";
import Icon from "./Icon";
export function Header({
  path,
  go,
}: {
  path: string;
  go: (path: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const link = (target: string) => {
    go(target);
    setOpen(false);
  };
  return (
    <header className="header">
      <div className="nav container">
        <button className="brand" onClick={() => link("/")}>
          <span className="brand-mark">
            <Icon name="shield" size={19} />
          </span>
          <span>
            Tố Cáo
            <br />
            <b>Lừa Đảo</b>
          </span>
        </button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          <button
            className={path === "/" ? "active" : ""}
            onClick={() => link("/")}
          >
            Tra cứu
          </button>
          <button
            className={path === "/list/admin" ? "active" : ""}
            onClick={() => link("/list/admin")}
          >
            Danh sách admin
          </button>
          <button
            className={path === "/middleman" ? "active" : ""}
            onClick={() => link("/middleman")}
          >
            Giao dịch trung gian
          </button>
          <button
            className={path === "/list/scam" ? "active" : ""}
            onClick={() => link("/list/scam")}
          >
            Danh sách scam
          </button>
          <button onClick={() => link("/news/tham-gia-bao-hiem")}>
            Đăng ký admin
          </button>
          <button className="report-link" onClick={() => link("/report/scam")}>
            <Icon name="flag" size={16} /> Tố cáo scam
          </button>
        </nav>
        <button
          className="menu-btn"
          aria-label="Mở menu"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "x" : "menu"} />
        </button>
      </div>
    </header>
  );
}
export function Footer({ go }: { go: (path: string) => void }) {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">
              <Icon name="shield" size={19} />
            </span>
            <span>
              Tố Cáo <b>Lừa Đảo</b>
            </span>
          </div>
          <p>
            Nền tảng cộng đồng giúp kiểm tra, lưu trữ và cảnh báo thông tin lừa
            đảo khi giao dịch trực tuyến.
          </p>
          <span className="location">⌖ Phú Lương — Thái Nguyên</span>
        </div>
        <div>
          <h4>Thông tin</h4>
          <button onClick={() => go("/news/gioi-thieu")}>Giới thiệu</button>
          <button onClick={() => go("/news/thong-bao")}>Thông báo</button>
          <button onClick={() => go("/list/scam")}>Cảnh báo lừa đảo</button>
        </div>
        <div>
          <h4>Chính sách</h4>
          <button onClick={() => go("/news/xu-ly-tranh-chap")}>
            Xử lý tranh chấp
          </button>
          <button onClick={() => go("/news/bao-cao-vi-pham")}>
            Báo cáo vi phạm
          </button>
          <button onClick={() => go("/news/bao-mat-thong-tin")}>
            Bảo mật thông tin
          </button>
        </div>
        <div>
          <h4>Liên hệ</h4>
          <a href="tel:0966175222">0966 175 222</a>
          <a href="https://t.me/TOPGDT" target="_blank" rel="noreferrer">
            Telegram cộng đồng
          </a>
          <button onClick={() => go("/report/scam")}>
            Gửi tố cáo <Icon name="arrow" size={15} />
          </button>
        </div>
      </div>
      <div className="copyright">
        © 2021–2026 Tố Cáo Lừa Đảo. Kiểm tra trước khi giao dịch.
      </div>
    </footer>
  );
}
