export type ScamListRow = {
  name: string;
  amount: string;
  phone: string;
  account: string;
  bank: string;
  views: number | string;
  date: string;
};

export function filterScams(
  rows: ScamListRow[],
  search: string,
  bank: string,
): ScamListRow[] {
  const query = search.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesSearch =
      !query ||
      [row.name, row.amount, row.phone, row.account, row.bank]
        .join(" ")
        .toLowerCase()
        .includes(query);
    const matchesBank = bank === "all" || row.bank === bank;
    return matchesSearch && matchesBank;
  });
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  if (pageSize <= 0) return [];
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
