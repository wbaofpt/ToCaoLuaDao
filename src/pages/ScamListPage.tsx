import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { Footer } from "../components/SiteChrome";
import { scamRows, adminNames, categories, slugify } from "../data/scams";
function Table({ go }: { go: (path: string) => void }) {
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
          {scamRows.map((row) => (
            <tr key={row[0]}>
              <td>
                <b>
                  <span className="person-mark">●</span>
                  <button
                    className="scam-name"
                    onClick={() => go(`/scam/${slugify(row[0])}`)}
                  >
                    {row[0]}
                  </button>
                </b>
              </td>
              <td className="amount">{row[1]}</td>
              <td className="mono">{row[2]}</td>
              <td className="mono">{row[3]}</td>
              <td>
                <span className="bank">{row[4]}</span>
              </td>
              <td>{row[5]} lượt xem</td>
              <td>{row[6]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default function ScamListPage({
  path,
  go,
}: {
  path: string;
  go: (path: string) => void;
}) {
  const isScam = path === "/list/scam";
  const middleman = path.includes("trung-gian");
  const selectedSlug = path.includes("/category/admin/")
    ? path.split("/category/admin/")[1]
    : middleman
      ? "gd-trung-gian"
      : "";
  const [dbCategories, setDbCategories] = useState<
    Array<{ id: number; name: string; slug: string }>
  >([]);
  const [dbAdmins, setDbAdmins] = useState<
    Array<{ id: number; name: string; category: string }>
  >([]);
  useEffect(() => {
    if (!isScam) {
      fetch("http://localhost:3001/api/categories")
        .then((response) => response.json())
        .then(setDbCategories)
        .catch(() => {});
      fetch(`http://localhost:3001/api/admins?category=${selectedSlug}`)
        .then((response) => response.json())
        .then(setDbAdmins)
        .catch(() => {});
    }
  }, [isScam, selectedSlug]);
  const categoryItems = dbCategories.length
    ? dbCategories
    : categories.map((name, id) => ({
        id,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/gi, "-"),
      }));
  const adminItems = dbAdmins.length
    ? dbAdmins.map((admin) => admin.name)
    : middleman
      ? adminNames.slice(0, 6)
      : adminNames;
  return (
    <>
      <main className="page-main container">
        <div className="page-intro">
          <span className="section-kicker">Danh mục cộng đồng</span>
          <h1>
            {isScam
              ? "Danh sách cảnh báo scam"
              : middleman
                ? "Giao dịch viên trung gian"
                : "Danh sách admin uy tín"}
          </h1>
          <p>
            {isScam
              ? "Kiểm tra thông tin trước khi chuyển tiền. Dữ liệu được tổng hợp từ các tố cáo đã xác minh."
              : "Tìm giao dịch viên phù hợp cho các giao dịch game, mạng xã hội và dịch vụ số."}
          </p>
        </div>
        {!isScam && (
          <div className="category-row">
            {categoryItems.map((item) => (
              <button
                key={item.id}
                className={selectedSlug === item.slug ? "selected" : ""}
                onClick={() => go(`/list/category/admin/${item.slug}`)}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
        {isScam ? (
          <Table go={go} />
        ) : (
          <>
            <div className="list-label">
              <span>{middleman ? "Admin trung gian" : "Hạng vàng"}</span>
              <small>Được cộng đồng tin chọn</small>
            </div>
            <div className="admin-grid">
              {adminItems.map((name, i) => (
                <article className="admin-card" key={name}>
                  <div className="avatar">
                    {name
                      .split(" ")
                      .map((v) => v[0])
                      .slice(-2)
                      .join("")}
                  </div>
                  <div>
                    <span className="verified">
                      <Icon name="check" size={13} /> Đã xác thực
                    </span>
                    <h3>{name}</h3>
                    <p>
                      {middleman
                        ? "Giao dịch trung gian · Đang hoạt động"
                        : `Giao dịch viên · ${i % 2 ? "Dịch vụ Game" : "GD trung gian"}`}
                    </p>
                  </div>
                  <Icon name="arrow" size={17} />
                </article>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer go={go} />
    </>
  );
}
