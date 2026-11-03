# Gửi yêu thương vào đất — Farm thuận tự nhiên (Lê Lam Sơn) 🌿

**Website:** https://guiyeuthuongvaodat.com/

**Phiên bản hiện tại:** v2.9.10 (03/11/2026) — nhật ký cập nhật tại [/phien-ban/](https://le-lam-son-farm.guiyeuthuongvaodat.com/phien-ban/)  
**Tên miền:** guiyeuthuongvaodat.com (chính), le-lam-son-farm.huongthiennature.com (vẫn hoạt động)  
**Hạ tầng:** GitHub + Cloudflare Pages  
**Cloudflare Pages project:** `farm-gui-yeu-thuong-vao-dat`  
**Production branch:** `main`

## Cách dự án vận hành

Website là mã tĩnh (HTML, CSS, JavaScript, ảnh, font, nhạc) nằm thẳng ở thư mục gốc repository — **không có bước build**. Mỗi commit lên `main` được Cloudflare tự triển khai. Website hiện không có phần máy chủ riêng (không có Cloudflare Pages Functions).

| Thành phần | Vai trò |
| --- | --- |
| `index.html`, `gioi-thieu/`, `cau-chuyen/`, `cua-hang/`, `doi-tac/`, `nhat-ky/`, `hoc-tap/`, `lien-he/`, `phien-ban/` | Các trang của website |
| `assets/` | CSS, JavaScript, ảnh, font, nhạc |
| `scripts/`, `.github/workflows/` | Lịch sử các bản phát hành trước (xem mục bên dưới) |

## Cập nhật nội dung

Chỉnh sửa trực tiếp tệp trong repository, commit lên nhánh `main`; Cloudflare sẽ tự triển khai. Sau mỗi lần phát hành, thêm một mục vào trang `phien-ban/` và cập nhật số phiên bản ở đầu README này.

## Bình luận bài viết (đã gỡ)

Khung bình luận ở các bài trong mục Học tập đã được gỡ ở v2.3.12 (01/11/2026), và toàn bộ phần máy chủ bình luận (hàm `functions/api/comments.js`, hàm duyệt `functions/api/admin/comments.js`, trang `quan-ly-binh-luan/`, cơ sở dữ liệu Cloudflare D1 `farm-yeu-thuong-comments`) được gỡ ở v2.3.13 (01/11/2026) vì chủ nông trại không có thời gian trả lời bình luận.

Muốn dựng lại: lấy mã từ lịch sử Git — `assets/comments.js`, `assets/comments.css` và `functions/` ở commit `f713ef6`; `quan-ly-binh-luan/` và `assets/admin-comments.js` ở commit `21135e8`. Cần tạo lại cơ sở dữ liệu D1 và gắn binding tên `DB` (**Settings** → **Bindings** → **Add** → **D1 database bindings**) rồi triển khai lại.

## Nguồn gốc và các script phát hành cũ

Website ban đầu được xây dựng trên ChatGPT Sites. Ngày 26/10/2026 (v2.2.0), mã đã build được sao chép về repository này (66 tệp; báo cáo sao chép đã được gỡ khỏi site ở v2.6.2) và từ đó được chỉnh sửa độc lập. Mã nguồn gốc có `build.py` (gói Farm-Yeu-Thuong-v0.2.21) **không** nằm trong repository này.

Workflow xuất lại bản từ trang ChatGPT cũ đã được gỡ ngày 31/10/2026 để không ghi đè các chỉnh sửa; nếu cần xem lại, lấy từ lịch sử Git (commit `725f8da`).

Các tệp trong `.github/workflows/` là lịch sử những bản phát hành trước: mỗi workflow tự chạy khi tệp script tương ứng trong `scripts/` được commit lên `main` (hoặc khi chạy thủ công), rồi tự vá HTML và commit lại. Vì vậy **đừng sửa các tệp trong `scripts/`** trừ khi chủ ý chạy lại bản phát hành đó.

## Giới hạn

Đây là bản xuất **website đã build**, không phải toàn bộ dự án biên tập gốc từ ChatGPT Sites. Các dịch vụ bên ngoài như biểu mẫu, mạng xã hội hoặc bản đồ vẫn cần kết nối đến nhà cung cấp tương ứng khi sử dụng.


## Cập nhật cửa hàng mỗi ngày (`assets/shop-data.json`)
- `updated`: ngày cập nhật, dạng `2026-11-03`.
- Mỗi món có `status`: `co-hang` (Có hàng), `sap-co` (Sắp có), `tam-het` (Tạm hết) hoặc `cho-cap-nhat` (Chờ cập nhật); tùy chọn `qty` (ví dụ "Còn khoảng 5 kg"), `price`, `season`, `note`.
- Thêm món mới: sao chép một dòng trong `items`, đổi `id`, `name`, `image`, `alt`; ảnh vuông 600×600 `.webp` để trong `assets/shop/`.
- Trang `/cua-hang/` đọc tệp này bằng `assets/shop.js`; không có bước build.

## Cập nhật v2.9.10 (03/11/2026)

- Tình nguyện viên (`tinh-nguyen/`): thẻ hỗ trợ tiền mặt viết lại đúng nội dung bài đăng Facebook của anh Sơn.

## Cập nhật v2.9.9 (03/11/2026)

- Câu chuyện: căn giữa nút “Dạo xem ảnh vườn”.
- Đồng hành (`doi-tac/`): ảnh ba thẻ đổi thành `nguoi-lam-vuon-thu-hoach-bap.webp`, `ca-tim-ca-chua-bap-non.webp`, `vuon-xen-tang.webp`; nút “Xem lời mời tình nguyện viên” có `target="_blank"`; bỏ liên kết “Quyền lợi và trách nhiệm”; khối “Cùng cho đi, cùng nhận lại” khôi phục nguyên bản.

## Cập nhật v2.9.8 (03/11/2026)

- Trang chủ: hình minh họa “Cây cũng có một khoảng trời riêng” được vẽ lại (`index.html`, khối `figure.section-cut`).
- Câu chuyện: thêm `assets/khu-vuon-xanh.webp` làm ảnh cuối bài, trước nút “Dạo xem ảnh vườn”.
- Tình nguyện viên (`tinh-nguyen/`): danh sách việc nữ và nam theo bài đăng; thay ảnh trùng bằng `assets/ban-tay-lem-dat-do.webp`; phúc lợi giữ đúng nội dung bài đăng của anh Sơn, không thêm mục nào khác; meta mô tả đồng bộ.
- Đồng hành (`doi-tac/`): đổi tên thẻ thành “Tình nguyện viên nông nghiệp” và “Đối tác đồng hành”; khối “Quyền lợi và trách nhiệm” (`#quyen-loi-trach-nhiem`) thay cho khối “Cùng cho đi, cùng nhận lại”; CSS bổ sung trong `assets/v290.css`.

## Cập nhật v2.9.7 (03/11/2026)

- Cửa hàng: hiện **thông báo của chủ farm** (nghỉ giao, hết hàng vì thời tiết, món mới…) ở đầu trang. Thông báo được viết ở Kho vườn (Mùa vụ & Cửa hàng → Thông báo cho khách) và đi cùng nguồn cấp `/api/shop-feed` trong trường `announcement` (`null` nếu không có). `assets/shop.js` chỉ dựng bằng `textContent` nên nội dung nhập vào không thể chèn mã; kiểu hiển thị ở cuối `assets/v250.css` (`.shop-announce`). Không có thông báo thì trang không đổi gì. Khi Kho vườn không phản hồi và trang dùng `shop-data.json` dự phòng, thông báo không hiện.

## Cập nhật v2.9.6 (03/11/2026)

- Ảnh chia sẻ `assets/farm-share-v291.jpg`: chữ tiêu đề cỡ 80 px, xuống dòng ba dòng, nằm trong khung bên trái. Đổi tên tệp để Zalo và Facebook không dùng bản cache cũ. Tệp v280 và v0221 vẫn giữ.

## Cập nhật v2.9.5 (03/11/2026)

- Các trang: khối ba nút liên hệ (Zalo, gọi điện, form) gom thành một nút “Liên hệ” → `/lien-he/`.

## Cập nhật v2.9.4 (03/11/2026)

- Cửa hàng: `assets/shop.js` đọc danh sách từ Kho vườn (`https://quan-ly-kho-hang.guiyeuthuongvaodat.com/api/shop-feed`); nếu Kho vườn không phản hồi trong 6 giây thì dùng `assets/shop-data.json` như trước. Món mới thêm ở Kho hiện ở Cửa hàng sau tối đa vài chục giây.
- `_headers`: thêm địa chỉ Kho vườn vào `connect-src` và `img-src` (nếu đổi địa chỉ Kho, phải sửa cả hai chỗ này và `KHO_FEED` trong `assets/shop.js`).
- Tìm kiếm Cửa hàng khớp cả từ khóa; hiện mô tả ngắn của món.

## Cập nhật v2.9.3 (03/11/2026)

- Thanh menu: phục hồi mục “Câu chuyện” (`/cau-chuyen/`) sau “Giới thiệu”.

## Cập nhật v2.9.2 (03/11/2026)

- Thanh menu: “Vườn” đổi thành “Giới thiệu” (trỏ tới `/gioi-thieu/`).

## Cập nhật v2.9.1 (03/11/2026)

- Cửa hàng: bỏ nút “Hỏi mình” trên từng món (`assets/shop.js`).

## Cập nhật v2.9.0 (03/11/2026)

- Trang mới `/tinh-nguyen/` (lời mời tình nguyện viên, phúc lợi, cơ chế tham gia, hỏi nhanh) với `assets/v290.css`. Nội dung lấy từ bài đăng tuyển TNV của chủ vườn; mức hỗ trợ tiền mặt 1–5 triệu đồng lấy từ bài đó, cần chủ vườn xác nhận khi thay đổi.
- Trang `/doi-tac/`: thẻ 01 tách hai cách bắt đầu và dẫn tới `/tinh-nguyen/`.
- Trang `/lien-he/`: bỏ khối “Nhắn nhanh”.

## Cập nhật v2.8.1 (03/11/2026)

- Ảnh chia sẻ mới `assets/farm-share-v280.jpg` (1200×630) dùng cho og:image và twitter:image trên tất cả trang; ảnh cũ `farm-share-v0221.jpg` giữ lại để link đã chia sẻ không bị gãy.
- Thêm `_headers`: HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options; cache vừa phải cho `/assets/*`.
- Nút In bài chuyển từ onclick nội tuyến sang `assets/v280.js`.
- `sitemap.xml` có `lastmod` 2026-11-03.

## Cập nhật v2.5.1 (02/11/2026)
Các bài Học tập số 06–09 được viết lại sâu hơn. Bài "Đất sống là gì?" có hình lát cắt đất `assets/dat-song-lat-cat.svg` (vẽ riêng, tự tạo) và kiểu dáng bổ sung trong `assets/v251.css`.

## Cập nhật v2.6.5 (02/11/2026)

- Khối `.shop-notice` dưới danh mục cửa hàng; hover/reveal cho trang Đồng hành (partners-v232.css).

## Cập nhật v2.6.4 (02/11/2026)

- Cửa hàng: giá đồng 40.000đ cho rau củ quả (trường `price` trong shop-data.json); món làm thủ công “Chưa có giá”. Menu “Đối tác” → “Đồng hành”.

## Cập nhật v2.6.3 (02/11/2026)

- Form liên hệ gọn (chip chủ đề, 1 ô “Zalo hoặc email”, contact.js tự tách email/phone); timeline Giới thiệu 5 mốc; sửa ảnh bìa và kích thước ảnh trong bài “Sâu trong vườn”.

## Cập nhật v2.6.2 (02/11/2026)

- Diện tích 1,2 hecta; vùng chạm >= 40px; cỡ chữ tối thiểu ~13px; ảnh thu nhỏ `assets/thumb/` cho lưới ảnh; `_redirects` chặn /scripts/, /README.md, /mirror-report.json; gỡ mirror-report.json; thống nhất “khu vườn”.

## Cập nhật v2.6.1 (02/11/2026)

- Kiểm tra ảnh trùng toàn site (MD5, dHash, đối sánh đặc trưng ORB): gỡ `met-nong-san-theo-mua.webp` và `vuon-xen-canh.webp` (trùng với `gio-rau-cu.webp` và `rau-nhin-tu-mat-dat.webp`); album còn 67 ảnh.
- Trang chủ, Đồng hành, bài “Nhật ký vườn minh bạch”: mỗi ảnh chỉ xuất hiện một lần trong một trang.

## Cập nhật v2.6.0 (02/11/2026)
- Trang Sản phẩm đã gộp vào Cửa hàng (`cua-hang/`); `_redirects` chuyển `/san-pham/` sang `/cua-hang/`.
- Form liên hệ trở lại: `assets/contact.js` gửi qua FormSubmit (`https://formsubmit.co/ajax/kieumanh2211@gmail.com`). **Lần gửi đầu tiên FormSubmit sẽ gửi một email kích hoạt đến hộp thư đó; bấm vào liên kết trong email (xem cả thư rác) thì các lời nhắn sau mới được chuyển đến.** Muốn đổi hộp thư nhận: sửa địa chỉ trong `lien-he/index.html` (thuộc tính `action`) và `assets/contact.js` (`ENDPOINT`).
- Nút "Hỏi mình" ở Cửa hàng mở `/lien-he/?mon=<tên món>`; `contact.js` điền sẵn chủ đề và lời nhắn. Các CTA cuối trang mở `/lien-he/?chu-de=ghe-tham|nong-san|tinh-nguyen|dong-hanh|hoi-ve-vuon` (kèm `&bai=<tên bài>` ở bài Học tập).
