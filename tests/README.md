# Tests

Thư mục này chứa các test tự động cho chức năng của dự án.

## Chạy test

```bash
npm test
```

Các test dùng `node:test` và chạy TypeScript thông qua `tsx`. Khi thêm chức năng mới,
đặt test theo nhóm trong thư mục này, ví dụ:

- `tests/routing.test.ts`: kiểm tra điều hướng và URL.
- `tests/api/`: kiểm tra API.
- `tests/components/`: kiểm tra component giao diện.

