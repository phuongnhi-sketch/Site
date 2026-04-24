# ACTIVE_TASK.MD - TỐI ƯU DASHBOARD & CLEANUP (v2.1)

## 1. Thông tin Task
- **Tên Task**: Chỉnh sửa Dashboard & Loại bỏ thuật ngữ "Gate".
- **Mục tiêu**: Cập nhật Dashboard lên v2.0 và làm sạch nhãn trạng thái theo ý chị Nhi.
- **Project Owner**: Nhi.

## 2. Phạm vi Task
- **Dashboard UI**: Cập nhật câu chào, version hiển thị (v2.0) và thêm emoji.
- **Status Labels**: Xóa bỏ các hậu tố "(Gate 1)", "(Gate 2)",... để giao diện chuyên nghiệp hơn.
- **Version**: Đảm bảo toàn bộ UI hiển thị v2.0.
- **RBAC Dashboard**: Thống kê số liệu dựa trên quyền hạn của từng User.
- **Admin Region Fix**: Cho phép Admin chọn Miền khi nộp site.
- **Nav Security**: Chỉ cho phép Admin/MB truy cập trang Soạn hồ sơ.

## 3. Kế hoạch (Plan)
- [x] Cập nhật `demo.html`: Sửa Dashboard greeting & version text.
- [x] Cập nhật `demo.html`: Loại bỏ "(Gate X)" khỏi các thẻ thống kê Dashboard.
- [x] Cập nhật `demo.html`: Phân quyền (filter) số liệu Dashboard theo Role/Brand.
- [x] Cập nhật `demo.html`: Thêm lựa chọn Miền (North/South) cho Admin & Ẩn menu Soạn hồ sơ.
- [x] GitHub: Đã commit và push toàn bộ thay đổi mới nhất lên repository.
- [ ] Rà soát lại `demo.html`: Đảm bảo không còn chữ "Gate" dư thừa trong các label hiển thị cho người dùng.
- [ ] Cập nhật tài liệu: Đảm bảo `progress.md` ghi nhận sự thay đổi này.

## 4. Skills cần dùng
- UI/UX Refinement.
- Frontend Development (HTML/JS).

## 5. Trạng thái hiện tại
- **Đã hoàn thành**: Chỉnh sửa code Dashboard và các nhãn chính.
- **Tiếp theo**: Rà soát lại các popup/thông báo xem còn chữ Gate không.

## 6. Ghi chú
- Chị Nhi muốn giao diện gọn gàng hơn, không cần quá kỹ thuật (Gate).
