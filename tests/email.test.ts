import assert from "node:assert/strict";
import test from "node:test";
import { renderStatusEmail } from "../server/email";

test("status email renders a clear approved state", () => {
  const html = renderStatusEmail(
    "Đơn đăng ký admin đã được duyệt",
    "Xin chào An, đơn của bạn đã được duyệt.",
  );
  assert.match(html, /Đã được duyệt/);
  assert.match(html, /Xin chào An/);
  assert.match(html, /TỐ CÁO LỪA ĐẢO/);
});

test("status email escapes user content", () => {
  const html = renderStatusEmail("Đã tiếp nhận", "<script>alert(1)</script>");
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});
