# UI_PROMPT.MD - HƯỚNG DẪN UI/UX POC

Dùng để thiết kế giao diện Site Management Web (POC).

## 1. Design Style
- **Modern Enterprise**: Giao diện sạch sẽ, chuyên nghiệp, sử dụng nhiều khoảng trắng.
- **Mobile-first**: Ưu tiên trải nghiệm trên điện thoại (vì MB và Project thường dùng mobile khi khảo sát).
- **Dashboard Layout**: 
    - Desktop: Sidebar bên trái.
    - Mobile: Menu điều hướng hoặc bottom navigation.

## 2. Các trang chính (Key Pages)
1. **Login Page**: Tối giản.
2. **Dashboard (Home)**: Hiển thị các thẻ thông số nhanh (Số lượng hồ sơ theo từng trạng thái).
3. **Site List**: 
    - Desktop: Table view với bộ lọc (status, region, date).
    - Mobile: Card view để dễ vuốt.
4. **Site Detail**: 
    - Hiển thị theo Section (Thông tin chung, Vị trí, Tài chính, Hình ảnh).
    - **Timeline Component**: Hiển thị chuỗi Q&A và lịch sử thay đổi trạng thái như một dòng chat.
5. **Create/Edit Form**: Form dài chia thành nhiều bước (Step form) để không gây ngợp.

## 3. Quy tắc Hiển thị (Security UI)
- Nếu User Role = **Project**: 
    - Ẩn/Mask hoàn toàn phần thông tin tài chính (Ví dụ: Hiển thị "********" hoặc thông báo "No permission").
- Trạng thái màu sắc (Badge):
    - Draft: Gray.
    - Submitted: Blue.
    - Under Review: Orange.
    - Survey: Purple.
    - Completed: Green.

## 4. Tương tác (Interaction)
- Hỗ trợ lưu bản nháp (Save Draft).
- Thông báo (Notifications) qua icon chuông (Bell icon).
- Tích hợp Map (Xem vị trí mặt bằng trên bản đồ).
