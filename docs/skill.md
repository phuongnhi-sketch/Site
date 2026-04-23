# SKILL.MD - DANH SÁCH KỸ NĂNG AI

Tài liệu này mô tả các kỹ năng mà AI Agent cần có và cách kích hoạt chúng trong dự án Site Management.

## 1. Nhóm kỹ năng Kỹ thuật (Engineering)
- **System Design**: Thiết kế cấu trúc hệ thống và module.
- **Clean Code & Refactor**: Viết code sạch, dễ bảo trì.
- **Debugging**: Tìm và sửa lỗi hiệu quả.
- **Web Development**: HTML, Javascript, CSS chuyên sâu.

## 2. Nhóm kỹ năng Sản phẩm (Product)
- **Feature Scoping**: Xác định phạm vi tính năng.
- **UX Thinking**: Tư duy về trải nghiệm người dùng.
- **Requirement Analysis**: Phân tích và làm rõ yêu cầu từ Nhi.

## 3. Nhóm kỹ năng Quản trị (Project Management)
- **Documentation**: Viết tài liệu rõ ràng, đầy đủ.
- **Token Optimization**: Tối ưu hóa việc sử dụng context để tiết kiệm token.
- **Change Management**: Quản lý sự thay đổi qua `UpdateProject`.

## 4. Cơ chế kích hoạt kỹ năng
- **Tự động**: AI tự xác định skill cần thiết dựa trên loại task.
- **Theo yêu cầu**: Nhi có thể yêu cầu AI kích hoạt skill cụ thể (ví dụ: "Em hãy dùng skill Researcher để tìm hiểu về Web Components").
- **Học hỏi**: Khi gặp skill gap, AI kích hoạt `Researcher` để học từ tài liệu chính thức (Official Docs).
