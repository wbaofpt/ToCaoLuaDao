import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { Footer } from "../../components/SiteChrome";
type Report = {
  id: number;
  scammerName: string;
  reporterName: string;
  reporterPhone: string;
  status: string;
};
type Application = {
  id: number;
  name: string;
  email: string;
  phone: string;
  services: string;
  status: string;
};
export default function AdminDashboardPage({
  go,
}: {
  go: (path: string) => void;
}) {
  const token = localStorage.getItem("adminToken");
  const [reports, setReports] = useState<Report[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  useEffect(() => {
    if (!token) {
      go("/admin/login");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    fetch("http://localhost:3001/api/admin/reports", { headers })
      .then((response) => response.json())
      .then(setReports)
      .catch(() => {});
    fetch("http://localhost:3001/api/admin/applications", { headers })
      .then((response) => response.json())
      .then(setApplications)
      .catch(() => {});
  }, [token, go]);
  const update = async (id: number, status: "published" | "rejected") => {
    await fetch(`http://localhost:3001/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    setReports((items) =>
      items.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };
  const updateApplication = async (id: number, status: "approved" | "rejected") => {
    await fetch(`http://localhost:3001/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    setApplications((items) =>
      items.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };
  if (!token) return null;
  return (
    <>
      <main className="admin-dashboard">
        <div className="admin-topbar">
          <div>
            <span className="section-kicker">Bảng điều khiển admin</span>
            <h1>Quản lý hồ sơ & tố cáo</h1>
          </div>
          <div className="admin-top-actions">
            <button
              className="outline-btn"
              onClick={() => go("/admin/profile")}
            >
              Sửa hồ sơ
            </button>
            <button
              className="outline-btn"
              onClick={() => {
                localStorage.removeItem("adminToken");
                go("/admin/login");
              }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
        <div className="admin-stat-grid">
          <div>
            <strong>{reports.length}</strong>
            <span>Tổng tố cáo</span>
          </div>
          <div>
            <strong>
              {reports.filter((report) => report.status === "pending").length}
            </strong>
            <span>Chờ kiểm duyệt</span>
          </div>
          <div>
            <strong>
              {reports.filter((report) => report.status === "published").length}
            </strong>
            <span>Đã công khai</span>
          </div>
        </div>
        <section className="admin-panel">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Kiểm duyệt</span>
              <h2>Danh sách tố cáo</h2>
            </div>
            <button className="text-btn" onClick={() => go("/")}>
              Xem website <Icon name="arrow" size={16} />
            </button>
          </div>
          {reports.length ? (
            <div className="admin-report-list">
              {reports.map((report) => (
                <article key={report.id} className="admin-report">
                  <div>
                    <span className={`status status-${report.status}`}>
                      {report.status === "pending"
                        ? "Chờ duyệt"
                        : report.status === "published"
                          ? "Đã công khai"
                          : "Đã từ chối"}
                    </span>
                    <h3>{report.scammerName}</h3>
                    <p>
                      Người tố cáo: {report.reporterName} ·{" "}
                      {report.reporterPhone}
                    </p>
                  </div>
                  <div className="admin-report-actions">
                    {report.status === "pending" && (
                      <>
                        <button
                          className="approve"
                          onClick={() => update(report.id, "published")}
                        >
                          <Icon name="check" size={15} /> Duyệt
                        </button>
                        <button
                          className="reject"
                          onClick={() => update(report.id, "rejected")}
                        >
                          <Icon name="x" size={15} /> Từ chối
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty">
              <Icon name="check" size={24} />
              <h3>Chưa có tố cáo</h3>
              <p>Các báo cáo mới sẽ xuất hiện tại đây để admin kiểm duyệt.</p>
            </div>
          )}
        </section>
        <section className="admin-panel" style={{ marginTop: 20 }}>
          <div className="section-heading">
            <div>
              <span className="section-kicker">Đăng ký admin</span>
              <h2>Đơn chờ duyệt</h2>
            </div>
          </div>
          {applications.length ? (
            <div className="admin-report-list">
              {applications.map((application) => (
                <article key={application.id} className="admin-report">
                  <div>
                    <span className={`status status-${application.status}`}>
                      {application.status === "pending"
                        ? "Chờ duyệt"
                        : application.status === "approved"
                          ? "Đã duyệt"
                          : "Đã từ chối"}
                    </span>
                    <h3>{application.name}</h3>
                    <p>{application.email} · {application.phone} · {application.services}</p>
                  </div>
                  {application.status === "pending" && (
                    <div className="admin-report-actions">
                      <button className="approve" onClick={() => updateApplication(application.id, "approved")}>
                        <Icon name="check" size={15} /> Duyệt
                      </button>
                      <button className="reject" onClick={() => updateApplication(application.id, "rejected")}>
                        <Icon name="x" size={15} /> Từ chối
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty">
              <h3>Chưa có đơn đăng ký</h3>
              <p>Các đơn đăng ký admin mới sẽ hiển thị tại đây.</p>
            </div>
          )}
        </section>
      </main>
      <Footer go={go} />
    </>
  );
}
