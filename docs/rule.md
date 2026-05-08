# RULE.MD - CÁC QUY TẮC BẤT DI BẤT DỊCH

Đây là nơi ghi các quy tắc mà AI Agent phải tuân thủ tuyệt đối trong dự án Site Management.

## 1. Giao tiếp và Xưng hô
- **Xưng hô**: AI tự xưng là "em", gọi Project Owner là "Nhi".
- **Ngôn ngữ**: Mặc định dùng tiếng Việt trong chat và tài liệu. Tiếng Anh chỉ dùng cho thuật ngữ kỹ thuật, code và comments.
- **Phong cách**: Rõ ràng, ngắn gọn, có cấu trúc. Không lan man.

## 2. Nguyên tắc Coding & Architecture
- **Clean Code**: Ưu tiên mã nguồn dễ đọc, dễ bảo trì.
- **Modular Thinking**: Chia nhỏ hệ thống thành các module độc lập.
- **Tính ổn định**: Không phá vỡ các tính năng cũ khi thêm tính năng mới.
- **Refactor**: Chỉ refactor khi thực sự cần thiết và phải nêu rõ phạm vi, lợi ích trước khi làm.
- **Giới hạn**: Không tự ý thay đổi kiến trúc tổng thể (architecture.md) nếu chưa được Nhi đồng ý.

## 3. Quy tắc làm việc với Files & Context
- **Token Optimization**: Không đọc toàn bộ repo. Luôn bắt đầu từ `context_index.md`.
- **Duy trì Memory**: Sau mỗi thay đổi lớn, phải chạy `.\UpdateProject` để đồng bộ lại tài liệu.
- **Không đoán**: Không tự ý đoán tên file, API hay logic nếu chưa rõ. Hãy hỏi Nhi hoặc nghiên cứu thêm.

## 4. Quy trình xử lý Task
- Luôn tuân thủ quy trình: Phân tích -> Lập Plan -> Thực thi -> Review -> Cập nhật tài liệu.
- Mọi task mới phải được ghi vào `active_task.md`.

## 5. Tính ổn định & Luôn cộng dồn (No Regression Policy)
- **Tuyệt đối không xóa**: Không được phép xóa hoặc làm hỏng các tính năng đã chạy ổn định (như Dashboard, Login, Site List).
- **Cập nhật lũy tiến**: Mọi thay đổi phải mang tính chất cộng thêm (cumulative), giữ cái cũ và thêm cái mới.

## 6. Tiêu chuẩn Giao diện Crystal Clear Luxury
- **Phong cách**: Luxury Light, Glassmorphism 2.0, phông chữ Outfit/Inter.
- **Căn chỉnh**: Trang Đăng nhập phải luôn được căn giữa hoàn hảo (Perfectly Centered), không được lệch.
- **Tính thẩm mỹ**: Luôn giữ vẻ premium, không được đơn giản hóa giao diện làm mất chất lượng POC.

## 7. Bảo toàn Demo & Quy tắc Cập nhật Rule
- **demo.html**: Phải luôn chứa đầy đủ tất cả các trang (Dashboard, List, Create, Settings). Không được đơn giản hóa file này.
- **Cập nhật Rule**: Khi sửa file này, chỉ được phép thêm mới (append) vào cuối, không được ghi đè làm mất các rule cũ của Nhi.

## 8. Quy tắc Gate Pipeline & Bảo mật v2.0 ⭐ NEW
- **Gate-based Workflow**: Mọi hồ sơ phải đi qua đủ 3 Gate (Survey -> Sitepack -> Deal) trước khi Finish.
- **Finish Masking Rule**: Khi hồ sơ ở trạng thái **Finish**, giá thuê/cọc/điều khoản phải bị ẩn với tất cả user ngoại trừ Admin.
- **Versioning Logic**: Tại Gate 3, dữ liệu Version 2 là dữ liệu chốt Deal, không được làm mất Version 1 (dữ liệu gốc). **Admin có quyền chỉnh sửa nội dung Version 2** sau khi khởi tạo để khớp với thỏa thuận cuối cùng.
- **Brand Grouping**: BOD Level 2 theo dõi site theo Brand (TPC, DQ, SW, CHANG). DQ và SW chia sẻ chung BOD Level 2, do đó người dùng thuộc 2 brand này có quyền xem chéo hồ sơ của nhau.
- **Stage Labeling**: Mọi comment mới phải được gán nhãn Stage hiện tại để tra cứu bối cảnh lịch sử.

## 9. Quy tắc Git & Version Control ⭐ NEW
- **GitHub Sync**: Luôn phải `git add`, `git commit` và `git push` lên GitHub mỗi khi hoàn thành một version mới hoặc một task lớn.
- **Commit Message**: Phải sử dụng tiếng Anh, mô tả rõ ràng các thay đổi (ví dụ: "Upgrade demo.html to v2.0 - Gate Pipeline").
- **Branching**: Mặc định làm việc trên branch `master` hoặc `main` cho bản POC.

## 10. Quy tắc cập nhật Bản đồ (Map Dashboard) & demo.html ⭐ NEW
- **Thận trọng với chuỗi lớn (SVG Map)**: Tuyệt đối không dùng các script thao tác chuỗi (regex/replace) bừa bãi lên `demo.html` để gắn SVG nếu không kiểm tra kĩ các anchor points.
- **Xung đột `<style>`**: Lưu ý trong `demo.html` có chứa lệnh JavaScript `win.document.write('<style>...</style>')` phục vụ in PDF. Tuyệt đối không tiêm CSS mới làm hỏng cú pháp chuỗi của JS ở khu vực này.
- **Tính trọn vẹn**: Bất kỳ sửa đổi nào trên Map Dashboard (chỉnh màu, thêm vùng, zoom) không được làm gián đoạn luồng render `handleRoute()` khiến trang bị trắng (blank page).

## 11. Quy tắc Bảo toàn Ký tự & Encoding (UTF-8) ⭐ NEW
- **UTF-8 Only**: File `demo.html` và mọi file tài liệu phải được lưu ở định dạng **UTF-8**. Tuyệt đối không lưu ở ANSI hay Windows-1252.
- **Emoji Preservation**: Thận trọng tối đa khi dùng các script tự động (PowerShell/Python) để sửa text. Các ký tự icon/emoji (như ✍️, 👁️, 🖨️) rất dễ bị biến thành mã rác (mangled) nếu script không hỗ trợ tốt Unicode.
- **Byte-level Safety**: Nếu phát hiện lỗi encoding, ưu tiên dùng các công cụ sửa lỗi ở cấp độ byte hoặc hex để phục hồi chính xác, tránh làm hỏng các ký tự xung quanh.

## 12. Nguyên tắc Bảo tồn Tính năng cũ (Legacy Integrity) ⭐ NEW
- **Tuyệt đối không sửa cũ**: Không được tự ý thay đổi, xóa bỏ hoặc "tối ưu hóa" các đoạn code, tính năng đã có từ trước nếu Nhi chưa yêu cầu hoặc chưa đồng ý rõ ràng.
- **Ưu tiên thêm mới**: Mọi tính năng mới nên được viết bổ sung hoặc tách biệt, tránh can thiệp sâu vào logic cũ đang chạy ổn định.
- **Xác nhận trước khi sửa**: Nếu phát hiện code cũ có lỗi hoặc cần cải tiến, phải báo cáo và chờ Nhi phê duyệt phương án sửa đổi trước khi thực hiện.

## 13. Quy tắc Bảo mật & Triển khai Supabase ⭐ NEW
- **Supabase Auth First**: Tuyệt đối không sử dụng chính sách `anon` (vô danh) có quyền ghi/sửa trong môi trường Production. Mọi thao tác dữ liệu phải được thực hiện thông qua `authenticated` session.
- **Tính nhất quán Schema**: Khi viết Trigger hoặc Function trên Supabase, phải kiểm tra kỹ bảng đích (ví dụ: dùng bảng `users` thay vì `profiles` nếu đó là cấu trúc thực tế của database).
- **Quản lý Credentials**: Mật khẩu và thông tin đăng nhập demo phải tuân thủ đúng bảng mapping trong tài liệu bàn giao. Không chia sẻ key Supabase ra ngoài phạm vi dự án.
- **An toàn RLS**: Luôn kiểm tra lại Row Level Security (RLS) sau mỗi lần thay đổi schema để đảm bảo dữ liệu nhạy cảm (giá thuê, thông tin tài chính) không bị rò rỉ cho các vai trò không có quyền.

---
**Trạng thái: ĐÃ KÍCH HOẠT (ACTIVE)**
*Ngày cập nhật: 08/05/2026 - v3.0*
