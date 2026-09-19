import assert from "node:assert/strict";
import test from "node:test";
import { categories, scamRows, slugify } from "../src/data/scams";
import { filterScams, paginate, type ScamListRow } from "../src/utils/scams";

const rows: ScamListRow[] = [
  {
    name: "Nguyễn Thanh Quang",
    amount: "150.000đ",
    phone: "0593313357",
    account: "090458524",
    bank: "BANK",
    views: 78,
    date: "12/09/2026",
  },
  {
    name: "Phan Trường Chiến",
    amount: "1.000.000đ",
    phone: "0383201559",
    account: "0383201559",
    bank: "VPBANK",
    views: 62,
    date: "12/09/2026",
  },
];

test("slugify creates stable Vietnamese URLs", () => {
  assert.equal(slugify("Nguyễn Thanh Quang"), "nguyen-thanh-quang");
  assert.equal(slugify("Đại thành tề thiên"), "dai-thanh-te-thien");
  assert.equal(slugify("  Tên   có dấu  "), "ten-co-dau");
});

test("scam data has the fields required by the list", () => {
  assert.ok(scamRows.length > 0);
  assert.ok(categories.length >= 8);
  for (const row of scamRows) assert.equal(row.length, 7);
});

test("scam search matches name, phone, account and bank", () => {
  assert.equal(filterScams(rows, "thanh quang", "all").length, 1);
  assert.equal(filterScams(rows, "0383201559", "all")[0]?.name, "Phan Trường Chiến");
  assert.equal(filterScams(rows, "VPBANK", "all")[0]?.name, "Phan Trường Chiến");
  assert.equal(filterScams(rows, "quang", "VPBANK").length, 0);
});

test("bank filter and pagination return only the requested records", () => {
  assert.equal(filterScams(rows, "", "BANK")[0]?.name, "Nguyễn Thanh Quang");
  assert.deepEqual(paginate([1, 2, 3, 4, 5], 2, 2), [3, 4]);
  assert.deepEqual(paginate([1, 2, 3], 0, 2), [1, 2]);
  assert.deepEqual(paginate([1, 2, 3], 1, 0), []);
});
