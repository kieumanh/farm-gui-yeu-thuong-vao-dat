# Farm Yêu Thương — Lê Lam Sơn 🌿

**Website:** https://le-lam-son-farm.huongthiennature.com/

**Phiên bản nội dung được đồng bộ:** v2.2.0 (26/10/2026)  
**Hạ tầng:** GitHub + Cloudflare Pages  
**Cloudflare Pages project:** `farm-gui-yeu-thuong-vao-dat`  
**Production branch:** `main`

## Đồng bộ độc lập thành công

Mã triển khai tĩnh (HTML, CSS, JavaScript, ảnh, font, nhạc và tài nguyên liên quan) đã được sao chép từ phiên bản công khai của Farm Yêu Thương vào repository này. **Không còn sử dụng `_worker.js` proxy** để chuyển yêu cầu sang ChatGPT Site.

- Số tệp được thu thập: **66**
- Số tài nguyên tải lỗi: **0**
- Báo cáo chi tiết: [mirror-report.json](./mirror-report.json)
- Trang con: `/cau-chuyen/`, `/hoc-tap/`, `/phien-ban/` và các mục khác
- Deploy tự động từ GitHub lên Cloudflare Pages

## Cập nhật nội dung

Chỉnh sửa trực tiếp tệp trong repository, commit lên nhánh `main`; Cloudflare sẽ tự triển khai. Nếu cần lấy lại bản công khai từ trang gốc, có thể chạy thủ công workflow `Export latest Farm website` trong GitHub Actions. Lưu ý workflow sẽ thay mã nguồn tĩnh theo trang nguồn, vì vậy tránh chạy sau khi đã chỉnh sửa độc lập trên GitHub.

## Giới hạn

Đây là bản xuất **website đã build**, không phải toàn bộ dự án biên tập gốc từ ChatGPT Site. Các dịch vụ bên ngoài như API biểu mẫu, mạng xã hội hoặc bản đồ vẫn cần kết nối đến nhà cung cấp tương ứng khi sử dụng.
