# Farm Yêu Thương — Lê Lam Sơn 🌿

**Website:** https://le-lam-son-farm.huongthiennature.com/

**Phiên bản hiện tại:** v2.4.0 (02/11/2026) — nhật ký cập nhật tại [/phien-ban/](https://le-lam-son-farm.huongthiennature.com/phien-ban/)  
**Hạ tầng:** GitHub + Cloudflare Pages  
**Cloudflare Pages project:** `farm-gui-yeu-thuong-vao-dat`  
**Production branch:** `main`

## Cách dự án vận hành

Website là mã tĩnh (HTML, CSS, JavaScript, ảnh, font, nhạc) nằm thẳng ở thư mục gốc repository — **không có bước build**. Mỗi commit lên `main` được Cloudflare tự triển khai. Website hiện không có phần máy chủ riêng (không có Cloudflare Pages Functions).

| Thành phần | Vai trò |
| --- | --- |
| `index.html`, `gioi-thieu/`, `cau-chuyen/`, `san-pham/`, `doi-tac/`, `nhat-ky/`, `hoc-tap/`, `lien-he/`, `phien-ban/` | Các trang của website |
| `assets/` | CSS, JavaScript, ảnh, font, nhạc |
| `scripts/`, `.github/workflows/` | Lịch sử các bản phát hành trước (xem mục bên dưới) |

## Cập nhật nội dung

Chỉnh sửa trực tiếp tệp trong repository, commit lên nhánh `main`; Cloudflare sẽ tự triển khai. Sau mỗi lần phát hành, thêm một mục vào trang `phien-ban/` và cập nhật số phiên bản ở đầu README này.

## Bình luận bài viết (đã gỡ)

Khung bình luận ở các bài trong mục Học tập đã được gỡ ở v2.3.12 (01/11/2026), và toàn bộ phần máy chủ bình luận (hàm `functions/api/comments.js`, hàm duyệt `functions/api/admin/comments.js`, trang `quan-ly-binh-luan/`, cơ sở dữ liệu Cloudflare D1 `farm-yeu-thuong-comments`) được gỡ ở v2.3.13 (01/11/2026) vì chủ nông trại không có thời gian trả lời bình luận.

Muốn dựng lại: lấy mã từ lịch sử Git — `assets/comments.js`, `assets/comments.css` và `functions/` ở commit `f713ef6`; `quan-ly-binh-luan/` và `assets/admin-comments.js` ở commit `21135e8`. Cần tạo lại cơ sở dữ liệu D1 và gắn binding tên `DB` (**Settings** → **Bindings** → **Add** → **D1 database bindings**) rồi triển khai lại.

## Nguồn gốc và các script phát hành cũ

Website ban đầu được xây dựng trên ChatGPT Sites. Ngày 26/10/2026 (v2.2.0), mã đã build được sao chép về repository này (66 tệp, xem [mirror-report.json](./mirror-report.json)) và từ đó được chỉnh sửa độc lập. Mã nguồn gốc có `build.py` (gói Farm-Yeu-Thuong-v0.2.21) **không** nằm trong repository này.

Workflow xuất lại bản từ trang ChatGPT cũ đã được gỡ ngày 31/10/2026 để không ghi đè các chỉnh sửa; nếu cần xem lại, lấy từ lịch sử Git (commit `725f8da`).

Các tệp trong `.github/workflows/` là lịch sử những bản phát hành trước: mỗi workflow tự chạy khi tệp script tương ứng trong `scripts/` được commit lên `main` (hoặc khi chạy thủ công), rồi tự vá HTML và commit lại. Vì vậy **đừng sửa các tệp trong `scripts/`** trừ khi chủ ý chạy lại bản phát hành đó.

## Giới hạn

Đây là bản xuất **website đã build**, không phải toàn bộ dự án biên tập gốc từ ChatGPT Sites. Các dịch vụ bên ngoài như biểu mẫu, mạng xã hội hoặc bản đồ vẫn cần kết nối đến nhà cung cấp tương ứng khi sử dụng.
