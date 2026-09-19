export type PageKey =
  | "admin-login"
  | "admin"
  | "admin-profile"
  | "admin-register"
  | "admin-detail"
  | "detail"
  | "home"
  | "middleman-process"
  | "middlemen"
  | "admins"
  | "scams"
  | "report"
  | "info";

export function pageFor(path: string): PageKey {
  if (path === "/admin/login") return "admin-login";
  if (path === "/admin" || path === "/admin/dashboard") return "admin";
  if (path === "/admin/profile") return "admin-profile";
  if (path === "/admin/register") return "admin-register";
  if (path.startsWith("/admin/")) return "admin-detail";
  if (path.startsWith("/scam/")) return "detail";
  if (path === "/") return "home";
  if (path === "/middleman/process") return "middleman-process";
  if (path === "/middleman") return "middlemen";
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
