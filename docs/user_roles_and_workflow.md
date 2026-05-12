# 📚 Tài liệu Quản trị: Phân quyền & Luồng công việc (User Roles & Workflow)

Tài liệu này quy định chi tiết về quyền hạn của từng loại tài khoản, cơ chế thông báo và quy trình xử lý hồ sơ mặt bằng trong hệ thống **Site Management**.

---

## 1. Danh sách Role & Quyền hạn (Permissions)

| Role | Ý nghĩa | Quyền xem dữ liệu | Quyền thao tác |
| :--- | :--- | :--- | :--- |
| **ADMIN** | Quản trị viên | **Tất cả** (Toàn hệ thống) | Full quyền (Sửa/Xóa/Mở khóa/Duyệt/Quản lý User) |
| **BOD L1** | Ban giám đốc | **Tất cả** | Xem báo cáo, nhận thông báo, thảo luận |
| **BOD L2** | Quản lý Brand | Theo **Brand** được phân công | Xem báo cáo, nhận thông báo, thảo luận |
| **PROJECT** | Team Khảo sát | **Tất cả** | Xem hồ sơ, nhận yêu cầu khảo sát, cập nhật khảo sát |
| **MB (Site)** | Team Tìm mặt bằng | Theo **Vùng miền** (Bắc/Nam) | Tạo mới hồ sơ, sửa hồ sơ mình tạo, cập nhật trạng thái |

---

## 2. Ma trận Thông báo (Notification Matrix)

Khi một hồ sơ thay đổi trạng thái, hệ thống sẽ tự động gửi thông báo theo quy tắc sau:

| Trạng thái mới | Gửi Mail? | Ai nhận được? | Ghi chú |
| :--- | :---: | :--- | :--- |
| **Submitted** | ✅ Có | Admin, BOD L1, BOD L2 (theo Brand), MB (theo Miền) | Thông báo có hồ sơ mới nộp |
| **Survey** (GATE1) | ❌ Không | Admin, BOD L1, BOD L2, MB, **Team Project** | Yêu cầu khảo sát |
| **Sitepack** (GATE2)| ✅ Có | Admin, BOD L1, BOD L2, MB | Hồ sơ đã hoàn thiện hồ sơ kỹ thuật |
| **Deal** (GATE3) | ✅ Có | Admin, BOD L1, BOD L2, MB | Hồ sơ đang trong giai đoạn chốt hợp đồng |
| **Complete** (FINISH)| ❌ Không | Admin, BOD L1, BOD L2, MB | Hồ sơ hoàn tất thành công |
| **Rejected** | ❌ Không | Admin, BOD L1, BOD L2, MB | Hồ sơ bị từ chối |

> **🔔 Thông báo chuông:** Luôn được gửi cho tất cả các bên liên quan ở mọi bước.  
> **📧 Thông báo Mail:** Chỉ gửi ở các bước quan trọng (✅) để tránh làm loãng hòm thư.

---

## 3. Quy tắc Bảo mật Dữ liệu (Security Rules)

Hệ thống tự động lọc dữ liệu và thông báo dựa trên thông tin trong hồ sơ User:

*   **Lọc theo Vùng miền (Region)**: Áp dụng cho Role **MB**. Một nhân viên MB Miền Bắc sẽ không thấy hồ sơ và không nhận thông báo của Miền Nam.
*   **Lọc theo Thương hiệu (Brand)**: Áp dụng cho Role **BOD L2**. Một quản lý Brand TPC sẽ chỉ nhận thông báo và xem dữ liệu liên quan đến TPC.
*   **Quyền ALL**: Nếu User được set Region hoặc Brand là `ALL`, họ sẽ bỏ qua bộ lọc và thấy toàn bộ dữ liệu (Mặc định cho Admin, BOD L1, Project).

---

## 4. Luồng xử lý hồ sơ (Workflow)

1.  **Draft**: MB đang soạn thảo, chưa ai thấy.
2.  **Submitted**: MB nộp hồ sơ. Admin và BOD bắt đầu xem xét.
3.  **Survey**: Team Project vào cuộc khảo sát thực địa.
4.  **Sitepack**: Tổng hợp đầy đủ thông tin kỹ thuật, pháp lý.
5.  **Deal**: Thương thảo hợp đồng với chủ nhà.
6.  **Complete**: Chính thức chốt mặt bằng.
7.  **Rejected**: Ngừng theo dõi hồ sơ này.

---

## 5. Lưu ý cho Quản trị viên (Admin)

*   **Mở khóa bản ghi**: Khi hồ sơ đã nộp, MB sẽ bị khóa quyền sửa. Admin có nút "Unlock" trong trang chi tiết để cho phép MB sửa lại nếu cần.
*   **Quản lý User**: Luôn kiểm tra kỹ Email, Role, Region và Brand khi tạo User mới để đảm bảo bộ lọc thông báo hoạt động chính xác.
*   **Tài khoản giả**: Tránh gửi mail cho các tài khoản đuôi `@system.com` (Hệ thống đã tự động lọc nhưng nên hạn chế dùng các mail này làm mail chính).
