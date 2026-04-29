# ACTIVE_TASK.MD - QUẢN LÝ USER & BỎ TÍCH HỢP AI (v2.2)

## 1. Thông tin Task
- **Tên Task**: Tính năng Quản lý User và đăng nhập.
- **Mục tiêu**: Bỏ hạng mục tích hợp AI. Thêm trang quản lý User (Name, Username, Password, Role, Email nhận noti).
- **Project Owner**: Nhi.

## 2. Phạm vi Task
- **Data Layer**: Thêm `UserService` để lưu trữ dữ liệu người dùng vào `localStorage`.
- **UI/UX**: 
  - Thay đổi màn hình đăng nhập: Thêm form nhập Username/Password.
  - Thêm menu "Quản lý User" vào Sidebar (chỉ Admin).
  - Xây dựng giao diện danh sách user dạng bảng.
  - Form thêm/sửa user (nhập tên, mật khẩu, mức độ sử dụng, email).
- **Documents**: Cập nhật `progress.md` để loại bỏ AI.

## 3. Kế hoạch (Plan)
- [x] Cập nhật `docs/progress.md`: Xóa mục AI.
- [x] Cập nhật `demo.html`: Thêm `UserService`.
- [x] Cập nhật `demo.html`: Thêm `UserManagementView` và logic CRUD User.
- [x] Cập nhật `demo.html`: Sửa `#login` UI và logic để dùng Username/Password thực tế.

## 4. Skills cần dùng
- Frontend Development (HTML/JS).

## 5. Trạng thái hiện tại
- **Đã hoàn thành**: Thêm trang quản lý User và tích hợp form Login. Mọi yêu cầu của chị Nhi đã được xử lý xong.

