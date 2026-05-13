# 📚 Tài liệu Quản trị: Phân quyền & Luồng công việc (User Roles & Workflow)

Tài liệu này quy định chi tiết về quyền hạn của từng loại tài khoản, cơ chế thông báo và quy trình xử lý hồ sơ mặt bằng trong hệ thống **Site Management**.

---

## 1. Danh sách Role & Quyền hạn (Permissions)

| Role | Ý nghĩa | Quyền xem dữ liệu | Quyền thao tác |
| :--- | :--- | :--- | :--- |
| **ADMIN** | Quản trị viên | **Tất cả** (Toàn hệ thống) | Full quyền (Sửa/Xóa/Mở khóa/Duyệt/Quản lý User) |
| **BOD L1** | Ban giám đốc | **Tất cả** | Xem báo cáo, nhận thông báo, thảo luận |
| **BOD L2** | Quản lý Brand | Theo **Brand** được phân công | Xem báo cáo, nhận thông báo, thảo luận. **Đặc biệt**: Được xem hồ sơ của tất cả các Brand khác nếu Site đó đã ở trạng thái **Complete** hoặc **Rejected**. |
| **PROJECT** | Team Khảo sát | **Tất cả** | Xem hồ sơ, nhận yêu cầu khảo sát, cập nhật khảo sát. **Lưu ý**: Luôn bị ẩn thông tin về giá thuê (`*******`). |
| **MB (Site)** | Team Tìm mặt bằng | Theo **Vùng miền** (Bắc/Nam) | Tạo mới hồ sơ, sửa hồ sơ mình tạo, cập nhật trạng thái. |

---

## 2. Quy tắc Ẩn thông tin nhạy cảm (Data Masking)

Để đảm bảo bảo mật về chi phí và tài chính, hệ thống áp dụng cơ chế ẩn giá thuê (`*******`) như sau:

*   **Role PROJECT**: Không bao giờ thấy giá thuê (Ẩn 100% thời gian).
*   **Khi hồ sơ Hoàn tất (Complete)**: Toàn bộ các Role (MB, BOD L1, BOD L2) sẽ không còn thấy giá thuê nữa. Chỉ duy nhất **ADMIN** có quyền xem giá ở giai đoạn này.
*   **Trong Báo cáo Excel/PDF**: Quy tắc ẩn giá cũng được áp dụng tương tự như trên giao diện Web.

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

## 4. Ma trận Hiển thị & Quyền hạn (Chi tiết)

Bảng dưới đây quy định rõ "Ai thấy cái gì" và "Ai được làm gì" tại từng giai đoạn:

| Trạng thái hồ sơ | MB (Người nộp) | Project Team | BOD Level 1/2 | Admin |
| :--- | :--- | :--- | :--- | :--- |
| **DRAFT (Nháp)** | Thấy (Chỉ MB chủ) | ❌ Không thấy | ❌ Không thấy | Thấy |
| **SUBMITTED** | Thấy (Theo vùng) | ❌ Không thấy | Thấy | Thấy |
| **GATE 1 (Survey)** | Thấy | **Thấy (Bắt đầu)** | Thấy | Thấy |
| **GATE 2, 3** | Thấy | Thấy | Thấy | Thấy |
| **FINISH (Xong)** | Thấy (Ẩn giá) | Thấy (Ẩn giá) | Thấy (Ẩn giá) | Thấy hết |

### 🔒 Quy tắc Bảo mật Dữ liệu Tài chính (Giá thuê, Thuế...)
*   **Team Project**: Hệ thống **luôn luôn che giá** (`*******`). Team này chỉ tập trung vào kỹ thuật và mặt bằng.
*   **Tất cả các Role (trừ Admin)**: Khi hồ sơ chuyển sang trạng thái **FINISH (Hoàn tất)** hoặc **REJECTED (Từ chối)**, toàn bộ thông tin giá sẽ bị che lại để bảo mật deal.
*   **Admin**: Luôn thấy dữ liệu gốc trong mọi trường hợp.

### ✍️ Quyền chỉnh sửa đặc biệt
*   **Sửa MPSA**: Chỉ **ADMIN** mới có nút "Update MPSA". Thường thực hiện sau giai đoạn Survey.
*   **Sửa nội dung Site**: 
    *   MB chỉ được sửa khi hồ sơ ở trạng thái `DRAFT`. 
    *   Nếu muốn sửa khi đã nộp, MB phải bấm nút **"Gửi yêu cầu sửa"**, Admin sẽ bấm **"Unlock"** để đưa hồ sơ về `DRAFT` cho MB sửa.
    *   Admin có quyền sửa trực tiếp bất cứ lúc nào.

## 5. Lưu ý cho Quản trị viên (Admin)

*   **Mở khóa bản ghi**: Khi hồ sơ đã nộp, MB sẽ bị khóa quyền sửa. Admin có nút "Unlock" trong trang chi tiết để cho phép MB sửa lại nếu cần.
*   **Quản lý User**: Luôn kiểm tra kỹ Email, Role, Region và Brand khi tạo User mới để đảm bảo bộ lọc thông báo hoạt động chính xác.
*   **Tài khoản giả**: Tránh gửi mail cho các tài khoản đuôi `@system.com` (Hệ thống đã tự động lọc nhưng nên hạn chế dùng các mail này làm mail chính).
