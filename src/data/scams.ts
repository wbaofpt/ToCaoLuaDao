export const scamRows = [
  [
    "Nguyễn Thanh Quang",
    "150.000đ",
    "0593313357",
    "090458524",
    "BANK",
    "78",
    "12/09/2026",
  ],
  [
    "Phan Trường Chiến",
    "1.000.000đ",
    "0383201559",
    "0383201559",
    "VPBANK",
    "62",
    "12/09/2026",
  ],
  [
    "Đại thánh tề thiên",
    "40.000đ",
    "0123456678",
    "00000000000",
    "TCB",
    "31",
    "12/09/2026",
  ],
  [
    "Phạm Tấn Đạt",
    "200.000đ",
    "0369809185",
    "8864976078",
    "BIDV",
    "18",
    "11/09/2026",
  ],
  [
    "Nguyễn Minh Khang",
    "4.850.000đ",
    "0563230500",
    "0563230500",
    "VPBANK",
    "30",
    "11/09/2026",
  ],
  [
    "Dũng Lê",
    "1.900.000đ",
    "0005449721",
    "000005449721",
    "BANK",
    "20",
    "10/09/2026",
  ],
  [
    "Nguyễn Quốc Thành",
    "4.500.000đ",
    "0375083845",
    "6979688699",
    "MB",
    "38",
    "10/09/2026",
  ],
  [
    "Trương Văn Anh",
    "18.000đ",
    "0993936434",
    "202278578888",
    "TCB",
    "14",
    "10/09/2026",
  ],
  [
    "Nguyen Van A",
    "100.000đ",
    "0923824888",
    "4729494",
    "Momo",
    "12",
    "09/09/2026",
  ],
  [
    "Đinh hoàng minh",
    "1.500.000đ",
    "0799129609",
    "2809200766",
    "TCB",
    "23",
    "09/09/2026",
  ],
];
export const adminNames = [
  "Trần Huy Thành",
  "Gà Con Juice",
  "Ngô Hoàng Sơn",
  "Ngô Văn Bắp",
  "Nguyễn Trọng Đại",
  "Nguyễn Việt Anh",
  "Đặng Thế Bình",
  "Triết Béo",
  "Hải Đinh",
];
export const categories = [
  "Tất cả",
  "GD trung gian",
  "Dịch vụ Game",
  "Dịch vụ FB",
  "Dịch vụ Tiktok",
  "Phần mềm",
  "Tài nguyên ADS",
  "Liên Quân",
];
export const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
