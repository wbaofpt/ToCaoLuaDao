import assert from "node:assert/strict";
import test from "node:test";
import { pageFor } from "../src/routing";

test("admin registration has its own route", () => {
  assert.equal(pageFor("/admin/register"), "admin-register");
});

test("admin profile routes remain distinct", () => {
  assert.equal(pageFor("/admin/profile"), "admin-profile");
  assert.equal(pageFor("/admin/tran-huy-thanh"), "admin-detail");
});

test("main public routes resolve to the expected pages", () => {
  assert.equal(pageFor("/"), "home");
  assert.equal(pageFor("/list/scam"), "scams");
  assert.equal(pageFor("/list/admin"), "admins");
  assert.equal(pageFor("/report/scam"), "report");
});
