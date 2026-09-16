import { useState } from "react";
import { Header } from "./components/SiteChrome";
import HomePage from "./pages/HomePage";
import ScamListPage from "./pages/ScamListPage";
import ScamDetailPage from "./pages/ScamDetailPage";
import ReportPage from "./pages/ReportPage";
import InfoPage from "./pages/InfoPage";
import AdminPage, { AdminLoginPage } from "./pages/AdminPage";

function pageFor(path: string) {
  if (path === "/admin/login") return "admin-login";
  if (path === "/admin") return "admin";
  if (path.startsWith("/scam/")) return "detail";
  if (path === "/") return "home";
  if (
    path === "/list/admin" ||
    path.includes("/trung-gian") ||
    path.includes("/category/admin/")
  )
    return "admins";
  if (path === "/list/scam") return "scams";
  if (path === "/report/scam") return "report";
  return "info";
}
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
      {page !== "admin" && page !== "admin-login" && (
        <Header path={path} go={go} />
      )}
      {page === "home" && <HomePage go={go} />}
      {(page === "admins" || page === "scams") && (
        <ScamListPage path={path} go={go} />
      )}
      {page === "detail" && (
        <ScamDetailPage slug={path.slice("/scam/".length)} go={go} />
      )}
      {page === "report" && <ReportPage go={go} />}
      {page === "admin-login" && <AdminLoginPage go={go} />}
      {page === "admin" && <AdminPage go={go} />}
      {page === "info" && (
        <InfoPage
          title={
            path.includes("tham-gia")
              ? "Đăng ký admin"
              : "Thông tin & chính sách"
          }
          go={go}
        />
      )}
    </>
  );
}
