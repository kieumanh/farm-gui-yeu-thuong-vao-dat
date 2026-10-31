# Farm Yêu Thương — Lê Lam Sơn 🌿

**Website:** https://le-lam-son-farm.huongthiennature.com/

**Phiên bản hiện tại:** v2.3.10 (29/10/2026) — nhật ký cập nhật tại [/phien-ban/](https://le-lam-son-farm.huongthiennature.com/phien-ban/)  
**Hạ tầng:** GitHub + Cloudflare Pages  
**Cloudflare Pages project:** `farm-gui-yeu-thuong-vao-dat`  
**Production branch:** `main`

## Cách dự án vận hành

Website là mã tĩnh (HTML, CSS, JavaScript, ảnh, font, nhạc) nằm thẳng ở thư mục gốc repository — **không có bước build**. Mỗi commit lên `main` được Cloudflare tự triển khai. Phần động gồm hai hàm của Cloudflare Pages trong `functions/api/`.

| Thành phần | Vai trò |
| --- | --- |
| `index.html`, `gioi-thieu/`, `cau-chuyen/`, `san-pham/`, `doi-tac/`, `nhat-ky/`, `hoc-tap/`, `lien-he/`, `phien-ban/` | Các trang của website |
| `assets/` | CSS, JavaScript, ảnh, font, nhạc |
| `functions/api/comments.js` | Nhận và hiển thị bình luận bài viết |
| `functions/api/admin/comments.js` | Duyệt bình luận (chỉ chủ website dùng được) |
| `quan-ly-binh-luan/` | Trang duyệt bình luận (không hiện trên công cụ tìm kiếm) |
| `scripts/`, `.github/workflows/` | Lịch sử các bản phát hành trước (xem mục bên dưới) |

## Cập nhật nội dung

Chỉnh sửa trực tiếp tệp trong repository, commit lên nhánh `main`; Cloudflare sẽ tự triển khai. Sau mỗi lần phát hành, thêm một mục vào trang `phien-ban/` và cập nhật số phiên bản ở đầu README này.

## Bình luận bài viết

Khách gửi bình luận dưới các bài trong mục Học tập (`hoc-tap/`). Bình luận mới được lưu ở trạng thái `pending` (chờ duyệt) trong cơ sở dữ liệu Cloudflare D1 `farm-yeu-thuong-comments` (binding tên `DB`); chỉ bình luận đã duyệt (`approved`) mới hiện công khai. Email và số điện thoại của người gửi không bao giờ hiển thị công khai.

## Duyệt bình luận (dành cho chủ website)

Mở **https://le-lam-son-farm.huongthiennature.com/quan-ly-binh-luan/**, đăng nhập bằng mật khẩu quản trị, rồi chọn **Duyệt**, **Từ chối**, **Ẩn** hoặc **Xóa** cho từng bình luận.

**Đặt mật khẩu quản trị (làm một lần):**

1. Vào Cloudflare Dashboard → **Workers & Pages** → chọn project `farm-gui-yeu-thuong-vao-dat` → **Settings** → **Variables and Secrets** → **Add**.
2. Đặt tên biến là `ADMIN_TOKEN`; giá trị là một chuỗi ngẫu nhiên **từ 32 ký tự trở lên** (nên tạo bằng trình quản lý mật khẩu); bật **Encrypt**; bấm **Save**.
3. Triển khai lại project (ví dụ commit mới lên `main`) để biến có hiệu lực — biến chỉ được áp dụng cho các lần triển khai sau khi đặt.

Lưu ý:

- Khi chưa đặt `ADMIN_TOKEN` (hoặc ngắn hơn 32 ký tự), trang duyệt từ chối mọi yêu cầu — mặc định an toàn.
- Mật khẩu chỉ được giữ trong tab đang mở và mất khi đóng tab. Muốn đổi mật khẩu, sửa giá trị biến rồi triển khai lại.
- Bình luận lưu bằng binding `DB`. Nếu cần gắn lại: **Settings** → **Bindings** → **Add** → **D1 database bindings**, tên biến `DB`, chọn `farm-yeu-thuong-comments`, rồi triển khai lại.

## Nguồn gốc và các script phát hành cũ

Website ban đầu được xây dựng trên ChatGPT Sites. Ngày 26/10/2026 (v2.2.0), mã đã build được sao chép về repository này (66 tệp, xem [mirror-report.json](./mirror-report.json)) và từ đó được chỉnh sửa độc lập. Mã nguồn gốc có `build.py` (gói Farm-Yeu-Thuong-v0.2.21) **không** nằm trong repository này.

Workflow xuất lại bản từ trang ChatGPT cũ đã được gỡ ngày 31/10/2026 để không ghi đè các chỉnh sửa; nếu cần xem lại, lấy từ lịch sử Git (commit `725f8da`).

Các tệp trong `.github/workflows/` là lịch sử những bản phát hành trước: mỗi workflow tự chạy khi tệp script tương ứng trong `scripts/` được commit lên `main` (hoặc khi chạy thủ công), rồi tự vá HTML và commit lại. Vì vậy **đừng sửa các tệp trong `scripts/`** trừ khi chủ ý chạy lại bản phát hành đó.

## Giới hạn

Đây là bản xuất **website đã build**, không phải toàn bộ dự án biên tập gốc từ ChatGPT Sites. Các dịch vụ bên ngoài như biểu mẫu, mạng xã hội hoặc bản đồ vẫn cần kết nối đến nhà cung cấp tương ứng khi sử dụng.
