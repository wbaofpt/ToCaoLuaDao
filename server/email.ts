export type EmailTheme = "pending" | "approved" | "rejected";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getTheme(subject: string): EmailTheme {
  if (subject.includes("từ chối") || subject.includes("chưa được duyệt"))
    return "rejected";
  if (subject.includes("được duyệt")) return "approved";
  return "pending";
}

export function renderStatusEmail(subject: string, text: string) {
  const theme = getTheme(subject);
  const config = {
    pending: {
      label: "Đang chờ xử lý",
      color: "#b26b00",
      background: "#fff5dc",
    },
    approved: {
      label: "Đã được duyệt",
      color: "#16835f",
      background: "#e7faf3",
    },
    rejected: {
      label: "Chưa được duyệt",
      color: "#d92245",
      background: "#fff0f2",
    },
  }[theme];
  const paragraphs = text
    .split(/\n+/)
    .filter(Boolean)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 14px;color:#60708c;font-size:15px;line-height:1.65;">${escapeHtml(paragraph)}</p>`,
    )
    .join("");

  return `<!doctype html>
<html lang="vi"><body style="margin:0;background:#fffafb;font-family:Arial,Helvetica,sans-serif;color:#14213d;">
  <div style="padding:28px 12px;background:#fffafb;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #f2dfe2;border-radius:18px;overflow:hidden;">
      <tr><td style="padding:22px 28px;background:linear-gradient(135deg,#fb3155,#ff7188);color:#ffffff;">
        <div style="font-size:12px;font-weight:bold;letter-spacing:.04em;">TỐ CÁO LỪA ĐẢO</div>
        <div style="font-size:23px;font-weight:bold;margin-top:7px;">Cập nhật hồ sơ của bạn</div>
      </td></tr>
      <tr><td style="padding:30px 28px 22px;">
        <div style="display:inline-block;padding:8px 12px;border-radius:999px;background:${config.background};color:${config.color};font-size:13px;font-weight:bold;">${config.label}</div>
        <h1 style="margin:18px 0 14px;font-size:24px;line-height:1.3;color:#14213d;">${escapeHtml(subject)}</h1>
        ${paragraphs}
        <div style="margin-top:24px;padding:16px;border:1px solid #f2dfe2;border-radius:12px;background:#fffafb;">
          <div style="font-size:12px;color:#8b98aa;text-transform:uppercase;letter-spacing:.05em;font-weight:bold;">Lưu ý</div>
          <div style="margin-top:6px;color:#60708c;font-size:14px;line-height:1.55;">Bạn có thể liên hệ đội ngũ hỗ trợ nếu cần bổ sung hoặc chỉnh sửa thông tin.</div>
        </div>
      </td></tr>
      <tr><td style="padding:18px 28px;border-top:1px solid #f2dfe2;color:#9da8b7;font-size:12px;line-height:1.6;">Email tự động từ Tố Cáo Lừa Đảo. Vui lòng không trả lời trực tiếp email này.</td></tr>
    </table>
  </div>
</body></html>`;
}
