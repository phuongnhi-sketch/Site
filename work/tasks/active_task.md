# ACTIVE_TASK.MD - MAP DASHBOARD NÂNG CẤP (v2.3) ✅ ĐÃ HOÀN THÀNH

## 1. Thông tin Task
- **Tên Task**: Nâng cấp Map Dashboard — Vietnam SVG + RBAC + Statistics.
- **Mục tiêu**: Hiển thị bản đồ Việt Nam hình chữ S, phân màu 2 miền, thống kê pipeline, phân quyền theo region.
- **Project Owner**: Nhi.

## 2. Phạm vi Task
- **Map View**: Thay thế bản đồ Leaflet cũ bằng SVG Việt Nam tương tác (từ `vietnam.svg` do Nhi cung cấp).
- **Statistics Panel**: Hiển thị số liệu Complete / Other (Pipeline) / Rejected cho từng miền Bắc-Nam bên cạnh bản đồ.
- **Tương tác**: Click vào vùng miền → zoom vào Detail View; có nút "Back to Vietnam Map".
- **RBAC**: MB North chỉ thấy vùng Bắc; MB South chỉ thấy vùng Nam. Admin/BOD xem tất cả.
- **UI/CSS**: Cập nhật layout grid, stat-card styles, SVG styles cho `.map-region`.

## 3. Kế hoạch (Plan)
- [x] Tạo `map_view_template.js` — logic MapView component mới.
- [x] Tạo `new_map_view_fixed.js` — kết hợp SVG vào template.
- [x] Cập nhật CSS trong `demo.html` — thêm `.map-layout`, `.stats-group`, `.map-region`, v.v.
- [x] Cập nhật `demo.html` — replace MapView component cũ bằng phiên bản mới có SVG.
- [x] Xác minh encoding UTF-8 và tính toàn vẹn của file.

## 4. Trạng thái hiện tại
- **✅ HOÀN THÀNH**: Toàn bộ Map Dashboard đã được tích hợp vào `demo.html`.
- **✅ HOÀN THÀNH**: Encoding UTF-8 được xác nhận; ký tự tiếng Việt không bị hỏng.
- **File chính**: `demo.html` (298KB — bao gồm SVG data).
- **File helper** (có thể xóa sau): `map_view_template.js`, `new_map_view_fixed.js`, `apply_map_fix.js`, `svg_block.txt`.

## 5. Việc cần làm ở phiên tiếp theo
- [ ] Commit toàn bộ thay đổi lên Git.
- [ ] Test thực tế trên trình duyệt với tài khoản admin, mb_north, mb_south.
- [ ] (Tương lai) Tích hợp Google Maps API chính thức thay thế placeholder Detail View.
- [ ] (Tương lai) Tách MapView ra file `.js` riêng để giảm kích thước `demo.html`.


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
- [x] Cập nhật `demo.html`: Triển khai **Lightbox Service** và Gallery ảnh chuyên nghiệp.

## 4. Skills cần dùng
- Frontend Development (HTML/JS).

## 5. Trạng thái hiện tại
- **Đã hoàn thành**: Thêm trang quản lý User và tích hợp form Login.
- **Đã hoàn thành**: Sửa lỗi bấm vào ảnh nhảy sang trang trắng; triển khai Lightbox để xem và lướt ảnh trực tiếp trên Dashboard/Detail.

