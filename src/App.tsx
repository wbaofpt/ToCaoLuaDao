import { useState } from "react";
import { Header } from "./components/SiteChrome";
import HomePage from "./pages/HomePage";
import ScamListPage from "./pages/ScamListPage";
import ScamDetailPage from "./pages/ScamDetailPage";
import ReportPage from "./pages/ReportPage";
import InfoPage from "./pages/InfoPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminDetailPage from "./pages/admin/AdminDetailPage";
import MiddlemanPage from "./pages/MiddlemanPage";
import MiddlemanProcessPage from "./pages/MiddlemanProcessPage";
import ScamToast from "./components/ScamToast";
import AdminRegistrationPage from "./pages/AdminRegistrationPage";
import { pageFor } from "./routing";
export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const go = (next: string) => {
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  window.onpopstate = () => setPath(window.location.pathname);
  const page = pageFor(path);
  return (
    <>
      {page !== "admin" &&
        page !== "admin-login" &&
        page !== "admin-profile" && <Header path={path} go={go} />}
      {page === "home" && <HomePage go={go} />}
      {page === "middlemen" && <MiddlemanPage go={go} />}
      {page === "middleman-process" && <MiddlemanProcessPage go={go} />}
      {page === "admin-register" && <AdminRegistrationPage go={go} />}
      {(page === "admins" || page === "scams") && (
        <ScamListPage path={path} go={go} />
      )}
      {page === "detail" && (
        <ScamDetailPage slug={path.slice("/scam/".length)} go={go} />
      )}
      {page === "report" && <ReportPage go={go} />}
      {page === "admin-login" && <AdminLoginPage go={go} />}
      {page === "admin" && <AdminDashboardPage go={go} />}
      {page === "admin-profile" && <AdminProfilePage go={go} />}
      {page === "admin-detail" && (
        <AdminDetailPage slug={path.slice("/admin/".length)} go={go} />
      )}
      {page === "info" && (
        <InfoPage
          title={
            path.includes("tham-gia")
              ? "Đăng ký admin"
              : "Thông tin & chính sách"
          }
          go={go}
          registration={path.includes("tham-gia")}
        />
      )}
      <ScamToast
        go={go}
        enabled={
          page !== "admin" && page !== "admin-login" && page !== "admin-profile"
        }
      />
    </>
  );
}
