# Handover: Site Management Web POC (v2.0.7+)

## 1. Tóm tắt Phiên làm việc gần nhất
Phiên làm việc đã hoàn tất toàn bộ **Phase 4** của dự án Site Management. Hệ thống đã lột xác từ POC cơ bản thành một ứng dụng mạnh mẽ với các luồng phê duyệt và quản lý phiên bản rõ ràng.

### Các tính năng đã hoàn thiện:
- **Hệ thống Status/Gate (v2.0)**: Pipeline chuẩn gồm `Submitted` -> `Survey` (Gate 1) -> `Sitepack` (Gate 2) -> `Deal` (Gate 3) -> `Complete`.
- **Versioning (V1 vs V2)**: Tách biệt hoàn toàn `answers` (bản gốc) và `v2_data` (bản chốt Deal). Có UI chuyển đổi phiên bản trực quan.
- [x] **Cập nhật phân quyền (RBAC) cho số liệu thống kê trên Dashboard** (2026-04-24).
- [x] **Sửa lỗi Admin chọn Miền và Phân quyền điều hướng Soạn hồ sơ** (2026-04-24).
- [x] **Hoàn thiện tính năng Export/Reporting nâng cao (Excel, PDF, Q&A History)** (2026-04-24).
- [x] **Tối ưu hệ thống Thông báo (RBAC notifications) & Thêm bộ lọc trang danh sách** (2026-04-24).
- [x] **GitHub Update**: Đã đồng bộ toàn bộ v2.1 lên repository.
- **Bản đồ nâng cao (Phase 4)**: Tích hợp `Leaflet.js` hiển thị vị trí site theo tọa độ ảo, hỗ trợ lọc theo Trạng thái và Brand.
- **Hệ thống thông báo (Notifications)**: Tự động báo tin (kèm chấm đỏ) cho Admin, BOD (theo Brand) và Chủ sở hữu khi có site mới, chuyển gate hoặc comment.
- **Xuất báo cáo (Export CSV)**: Nút xuất báo cáo đa phiên bản, mỗi site nếu có V2 sẽ hiển thị thành 2 dòng riêng biệt (V1/V2).

## 2. Tình trạng Codebase
- File trung tâm: `demo.html` (chứa toàn bộ logic Frontend, LocalStorage DB, Routing).
- Lỗi Data Swap giữa V1/V2 và cứng trạng thái (Hardcoded SUBMITTED) đã được **khắc phục triệt để** ở v2.0.6.
- ID người dùng và thông báo đã được chuẩn hóa (chữ thường + brand) ở v2.0.7.

## 3. Việc cần làm tiếp theo (Phase 5)
1. **Tối ưu hóa hiệu năng**: Cải thiện bộ nhớ đệm, tối ưu nén ảnh (canvas) triệt để hơn để tránh lỗi QuotaExceededError.
2. **AI & Tích hợp**: Nghiên cứu đưa AI vào phân tích tiềm năng vị trí mặt bằng.
3. **Responsive UI**: Đánh giá và chỉnh sửa thêm giao diện trên thiết bị di động.
- [x] Cập nhật `demo.html`: Triển khai tính năng Export/Reporting (Chọn bản, Chọn mục để in).
- [x] Cập nhật `demo.html`: Sửa lỗi thông báo (BOD L1/Project) và thêm Bộ lọc (Filters).
- [x] GitHub: Đã commit và push toàn bộ thay đổi mới nhất (Bản v2.1 ổn định).

## 4. Chỉ thị cho Agent tiếp theo
- Xưng hô: Nhi - em.
- Tuyệt đối không thay đổi logic Deep Cloning (`JSON.parse(JSON.stringify)`) khi lưu V1/V2 trong `SiteService.save`.
- Khi cập nhật UI, ưu tiên sử dụng `glassmorphism`, `flexbox` và các màu sắc từ `CSS variables` đã định nghĩa.
