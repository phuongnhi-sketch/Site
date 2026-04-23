# ACTIVE_TASK.MD - TASK HIỆN TẠI (v2.0 Upgrade)

## 1. Thông tin Task
- **Tên Task**: Nâng cấp POC sang mô hình Gate Pipeline & Versioning (v2.0).
- **Mục tiêu**: Áp dụng các thay đổi từ Master Prompt mới vào bản demo.html.
- **Project Owner**: Nhi.

## 2. Phạm vi Task
- **Pipeline**: Đổi Under Review sang Gate 1 (Survey), Gate 2 (Sitepack), Gate 3 (Deal).
- **Data Model**: Bổ sung trường **Brand** và logic **BOD Level 2**.
- **Admin Tools**: Thêm form nhập MPSA Estimate (có history) và nút tạo Version 2 tại Gate 3.
- **Security**: Implement quy tắc ẩn thông tin tài chính sau khi **Finish**.
- **UI**: Cập nhật Timeline hiển thị Stage Context.

## 3. Kế hoạch (Plan)
- [x] Cập nhật toàn bộ tài liệu `docs/` và `prompt/` theo spec mới.
- [x] Sửa đổi `demo.html`: Thống nhất bộ Status mới (GATE1, GATE2, GATE3, FINISH).
- [x] Hiển thị UI: Submitted / Survey / Sitepack / Deal / Complete.
- [x] Implement logic phân quyền BOD Level 2 dựa trên Brand.
- [x] Xây dựng tính năng Versioning: Clone V1 sang V2 tại Gate 3.
- [x] Cập nhật Timeline component để gắn nhãn Stage.
- [x] Implement Finish Masking (Hide financial data after Finish).

## 4. Skills cần dùng
- State Management (Versioning logic).
- RBAC Logic (Brand-based visibility).
- UI/UX (Timeline stage labels).

## 5. Trạng thái hiện tại
- **Đã hoàn thành 100%** việc nâng cấp `demo.html` lên bản v2.0.
- Các tính năng mới (Brand, Gates, Versioning, MPSA) đã hoạt động trên bản POC.

## 6. Ghi chú
- File `demo.html` đã đạt bản v2.0.
- Nhi có thể kiểm tra các vai trò mới (BOD Level 1/2) tại màn hình đăng nhập.
