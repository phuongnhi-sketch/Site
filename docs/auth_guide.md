# Hướng dẫn Quản lý Tài khoản (Supabase Auth)

Tài liệu này giải thích cơ chế xác thực (Authentication) hiện tại của dự án Site Management, cũng như cách quản lý và tạo mới tài khoản.

## 1. Cơ chế Đăng nhập hiện tại (V3.3.0)
Dự án đã chuyển đổi thành công từ việc lưu tài khoản tạm bợ (Local Storage) sang hệ thống bảo mật cấp doanh nghiệp của **Supabase**.

- **Vercel** chỉ đóng vai trò là "Mặt tiền" (Frontend) hiển thị giao diện web.
- **Supabase** đóng vai trò là "Két sắt" (Backend + Database) lưu trữ toàn bộ dữ liệu và tài khoản.

Khi người dùng đăng nhập trên web (Vercel), web sẽ gửi email và mật khẩu thẳng tới Supabase để kiểm tra. Nếu Supabase báo hợp lệ, Vercel mới cho phép người dùng vào xem danh sách mặt bằng.

## 2. Giải đáp: Tạo tài khoản trên Vercel hay Supabase?
**Trạng thái hiện tại:**
- Chị **KHÔNG THỂ** tạo tài khoản nội bộ trực tiếp trên màn hình của Vercel (vì web hiện chưa có giao diện Đăng Ký cho Admin).
- Toàn bộ tài khoản **BẮT BUỘC** phải được tạo trên **Supabase**.

**Tuy nhiên, có một lưu ý quan trọng về lỗi Trigger (08/05/2026):**
Vì bảng `users` của chị đã có sẵn dữ liệu cũ (ví dụ: `admin-01`), việc tạo tài khoản bằng cách chạy code SQL trực tiếp vào bảng `auth.users` của Supabase sẽ bị lỗi xung đột dữ liệu (Database Constraint Error).
Để khắc phục, chúng ta đã đổi đuôi email thành `@system.com` và sử dụng **API của Supabase** (thông qua file `setup_users_api.js`) để khởi tạo 6 tài khoản demo một cách an toàn.

## 3. Cách tạo tài khoản mới trong tương lai
Để tạo thêm tài khoản cho nhân viên mới (ví dụ: `nhanvien@system.com`), chị có 2 cách:

### Cách 1: Sử dụng Supabase Dashboard (Dành cho người không biết code)
1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard).
2. Chọn dự án Site Management.
3. Đi tới mục **Authentication** -> **Users**.
4. Nhấn **Add User** -> **Create new user**.
5. Nhập Email (vd: `nhanvien@system.com`) và Password (vd: `123456`). Bỏ chọn "Auto Confirm User" nếu có.
6. (Tùy chọn) Chị có thể cần phải thêm thủ công thông tin của nhân viên này vào bảng `public.users` trong SQL Editor để họ có quyền xem/sửa mặt bằng.

### Cách 2: Sử dụng Script API (Khuyên dùng - giống cách AI đã làm)
1. Mở code của dự án trên máy tính.
2. Sửa file `setup_users_api.js`, thêm thông tin nhân viên mới vào danh sách `usersToCreate`.
3. Mở Terminal, chạy lệnh `node setup_users_api.js`.
Script này sẽ tự động mã hóa mật khẩu, gán danh tính (identity) và lưu an toàn vào Supabase mà không gây ra bất kỳ lỗi xung đột SQL nào.

## 4. Danh sách tài khoản mặc định
Tất cả đều có chung mật khẩu: `123456`
- **Admin**: `admin` (Tương đương `admin@system.com`)
- **Ngọc (MB Bắc)**: `ngoc`
- **Nam (BOD)**: `nam`
- **Team Project**: `project`
- **BOD TPC**: `tpc`
- **BOD SW**: `su`
