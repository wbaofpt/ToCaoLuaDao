import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { Footer } from "../components/SiteChrome";
import { slugify } from "../data/scams";
import { filterScams, paginate, type ScamListRow } from "../utils/scams";

function Table({ go, rows }: { go: (path: string) => void; rows: ScamListRow[] }) {
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
          {rows.map((row) => (
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
              <td className="mono">{row.phone}</td>
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
export default function ScamListPage({
  path,
  go,
}: {
  path: string;
  go: (path: string) => void;
}) {
  const isScam = path === "/list/scam";
  const middleman = path.includes("trung-gian");
  const routeSlug = path.includes("/category/admin/")
    ? path.split("/category/admin/")[1]
    : "";
  const selectedSlug =
    routeSlug === "trung-gian"
      ? "gd-trung-gian"
      : routeSlug || (middleman ? "gd-trung-gian" : "");
  const [dbCategories, setDbCategories] = useState<
    Array<{ id: number; name: string; slug: string }>
  >([]);
  const [dbAdmins, setDbAdmins] = useState<
    Array<{
      id: number;
      name: string;
      slug: string;
      avatarUrl?: string;
      category: string;
    }>
  >([]);
  const [adminsLoaded, setAdminsLoaded] = useState(false);
  const [scamSearch, setScamSearch] = useState("");
  const [bankFilter, setBankFilter] = useState("all");
  const [scamPage, setScamPage] = useState(1);
  const [scams, setScams] = useState<ScamListRow[]>([]);
  const [scamsLoaded, setScamsLoaded] = useState(false);
  useEffect(() => {
    if (!isScam) return;
    setScamsLoaded(false);
    fetch("http://localhost:3001/api/scams")
      .then((response) => response.json())
      .then((data) => setScams(Array.isArray(data) ? data : []))
      .catch(() => setScams([]))
      .finally(() => setScamsLoaded(true));
  }, [isScam]);
  useEffect(() => {
    setDbAdmins([]);
    setAdminsLoaded(false);
    if (!isScam) {
      fetch("http://localhost:3001/api/categories")
        .then((response) => response.json())
        .then(setDbCategories)
        .catch(() => {});
      fetch(`http://localhost:3001/api/admins?category=${selectedSlug}`)
        .then((response) => response.json())
        .then((admins) => setDbAdmins(admins))
        .catch(() => setDbAdmins([]))
        .finally(() => setAdminsLoaded(true));
    }
  }, [isScam, selectedSlug]);
  const categoryItems = [{ id: 0, name: "Tất cả", slug: "" }, ...dbCategories];
  const adminItems: Array<{
    id: number;
    name: string;
    slug: string;
    avatarUrl?: string;
    category: string;
  }> = adminsLoaded ? dbAdmins : [];
  const bankOptions = Array.from(new Set(scams.map((row) => row.bank)));
  const filteredScams = filterScams(scams, scamSearch, bankFilter);
  const scamPageSize = 20;
  const scamPageCount = Math.max(
    1,
    Math.ceil(filteredScams.length / scamPageSize),
  );
  const visibleScams = paginate(filteredScams, scamPage, scamPageSize);
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
                onClick={() =>
                  go(
                    item.slug
                      ? `/list/category/admin/${item.slug}`
                      : "/list/admin",
                  )
                }
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
        {isScam ? (
          <>
            <div className="scam-filters">
              <div className="scam-search">
                <Icon name="search" size={18} />
                <input
                  value={scamSearch}
                  onChange={(event) => {
                    setScamSearch(event.target.value);
                    setScamPage(1);
                  }}
                  placeholder="Tìm tên, SĐT, số tài khoản, ngân hàng..."
                  aria-label="Tìm kiếm cảnh báo scam"
                />
              </div>
              <select
                value={bankFilter}
                onChange={(event) => {
                  setBankFilter(event.target.value);
                  setScamPage(1);
                }}
                aria-label="Lọc theo ngân hàng"
              >
                <option value="all">Tất cả ngân hàng</option>
                {bankOptions.map((bank) => (
                  <option value={bank} key={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              {(scamSearch || bankFilter !== "all") && (
                <button
                  className="clear-filter"
                  onClick={() => {
                    setScamSearch("");
                    setBankFilter("all");
                    setScamPage(1);
                  }}
                >
                  Xóa lọc
                </button>
              )}
            </div>
            <div className="filter-result">
              Hiển thị {filteredScams.length} cảnh báo
            </div>
            {filteredScams.length ? (
              <>
                <Table go={go} rows={visibleScams} />
                {
                  <nav
                    className="pagination"
                    aria-label="Phân trang danh sách scam"
                  >
                    <button
                      disabled={scamPage === 1}
                      onClick={() => setScamPage((page) => page - 1)}
                    >
                      ← Trước
                    </button>
                    {Array.from(
                      { length: scamPageCount },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <button
                        className={page === scamPage ? "active" : ""}
                        key={page}
                        onClick={() => setScamPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      disabled={scamPage === scamPageCount}
                      onClick={() => setScamPage((page) => page + 1)}
                    >
                      Sau →
                    </button>
                  </nav>
                }
              </>
            ) : (
              <div className="empty-list">
                {scamsLoaded
                  ? "Không tìm thấy cảnh báo phù hợp."
                  : "Đang tải dữ liệu cảnh báo từ database..."}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="list-label">
              <span>{middleman ? "Admin trung gian" : "Hạng vàng"}</span>
              <small>Được cộng đồng tin chọn</small>
            </div>
            <div className="admin-grid">
              {!adminsLoaded && (
                <div className="empty-list">Đang tải danh sách admin...</div>
              )}
              {adminItems.map((admin, i) => (
                <article
                  className="admin-card"
                  key={admin.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => go(`/admin/${admin.slug}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ")
                      go(`/admin/${admin.slug}`);
                  }}
                >
                  <div className="avatar">
                    {admin.avatarUrl ? (
                      <img src={admin.avatarUrl} alt={admin.name} />
                    ) : (
                      <span>
                        {admin.name
                          .split(" ")
                          .filter(Boolean)
                          .map((part) => part[0])
                          .join("")}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="verified">
                      <Icon name="check" size={13} /> Đã xác thực
                    </span>
                    <h3>{admin.name}</h3>
                    <p>
                      {middleman
                        ? "Giao dịch trung gian · Đang hoạt động"
                        : `Giao dịch viên · ${admin.category || "Chưa phân loại"}`}
                    </p>
                  </div>
                  <Icon name="arrow" size={17} />
                </article>
              ))}
              {adminsLoaded && adminItems.length === 0 && (
                <div className="empty-list">
                  Chưa có admin trong danh mục này.
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer go={go} />
    </>
  );
}
