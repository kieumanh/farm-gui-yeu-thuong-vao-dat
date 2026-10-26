#!/usr/bin/env bash
set -euo pipefail

# User-provided photos temporarily staged as a verified ZIP in hosted object storage.
ARCHIVE_URL="https://ac9b60b8-8e6e-418c-9714-5f21416444e2.sandbox.floot.app/_cdn/static/1df0c808-6200-4bcf-a3dc-29be89eea6e1-farm-yeu-thuong-4-anh-album.zip"
ARCHIVE_SHA256="23e5c0715fea528790628a349fdff0488d7ede2ff6961251b76516c493b50a96"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
curl --fail --silent --show-error --location --retry 3 --max-time 80 "$ARCHIVE_URL" -o "$tmp/farm-photos.zip"
printf '%s  %s\n' "$ARCHIVE_SHA256" "$tmp/farm-photos.zip" | sha256sum -c -
for name in \
  01-ngoi-nha-giua-khu-vuon \
  02-luong-rau-xanh-va-gian-leo \
  03-bap-cai-duoi-tan-du-du \
  04-buong-chuoi-giua-vuon
do
  unzip -p "$tmp/farm-photos.zip" "assets/$name.webp" > "assets/$name.webp"
  test "$(stat -c %s "assets/$name.webp")" -gt 100000
done
python3 - <<'PY'
from pathlib import Path
from html import escape

album=Path("nhat-ky/anh-tu-vuon/index.html")
html=album.read_text(encoding="utf-8")
if '01-ngoi-nha-giua-khu-vuon.webp' in html:
    raise SystemExit("The four photos are already in the album; refusing duplication.")
photos=[
 ('01-ngoi-nha-giua-khu-vuon.webp','Ngôi nhà giữa khu vườn','Ngôi nhà gỗ giữa khu vườn xanh dưới bầu trời trong xanh'),
 ('02-luong-rau-xanh-va-gian-leo.webp','Luống rau xanh và giàn leo','Những luống rau tươi tốt xen với giàn tre trong vườn'),
 ('03-bap-cai-duoi-tan-du-du.webp','Bắp cải dưới tán đu đủ','Các luống bắp cải trên đất đỏ bên cây đu đủ và hoa dại'),
 ('04-buong-chuoi-giua-vuon.webp','Buồng chuối giữa vườn','Buồng chuối xanh ở tầng cây cao trong khu vườn'),
]
needle='<div class="farm-photo-grid">'
if html.count(needle)!=1:
    raise SystemExit("Unexpected gallery markup")
gallery_content=html.split(needle,1)[1].split('</div>',1)[0]
before=gallery_content.count('<figure>')
if before!=39:
    raise SystemExit(f"Expected 39 existing gallery photos, found {before}")
add=""
for filename,title,description in photos:
    add+=(
      '<figure><a href="/assets/'+filename+'" target="_blank" rel="noopener" '
      'aria-label="Xem ảnh lớn: '+escape(description,quote=True)+'">'
      '<img src="/assets/'+filename+'" alt="'+escape(description,quote=True)+'" '
      'loading="lazy" decoding="async" width="960" height="1280"></a>'
      '<figcaption>'+escape(title)+'</figcaption></figure>'
    )
html=html.replace(needle,needle+add,1)
html=html.replace('39 ảnh','43 ảnh')
album.write_text(html,encoding="utf-8")

page_count=0
for p in Path('.').rglob('*.html'):
    if any(part.startswith('.') or part in ('node_modules','assets','scripts','functions') for part in p.parts):continue
    s=p.read_text(encoding='utf-8')
    if p!=album:
        s=s.replace('39 ảnh','43 ảnh')
    s=s.replace('?v=2.3.0','?v=2.3.1')
    s=s.replace('phiên bản 2.3.0','phiên bản 2.3.1')
    s=s.replace('>v2.3.0</a>','>v2.3.1</a>')
    if p.as_posix()=='phien-ban/index.html':
        s=s.replace('Phiên bản hiện tại: <strong>v2.3.0</strong>','Phiên bản hiện tại: <strong>v2.3.1</strong>')
        marker='<ol class="release-list">'
        if marker not in s:raise SystemExit('Release timeline missing')
        release=(
          '<li><header><span class="release-version">v2.3.1</span>'
          '<span class="small">26/10/2026</span>'
          '<h2>Bốn góc vườn mới trong album</h2></header>'
          '<ul><li>Thêm bốn ảnh thật: ngôi nhà, luống rau và giàn leo, bắp cải dưới tán đu đủ, buồng chuối.</li>'
          '<li>Album mở rộng từ 39 lên 43 ảnh, tối ưu WebP cho desktop, tablet và mobile.</li></ul></li>'
        )
        s=s.replace(marker,marker+release,1)
    p.write_text(s,encoding='utf-8')
    page_count+=1

out=album.read_text(encoding='utf-8').split(needle,1)[1].split('</div>',1)[0]
if out.count('<figure>')!=43:
    raise SystemExit('Album photo count mismatch')
print(f'PASS: 4 new photos, 43 total images, {page_count} HTML pages updated, v2.3.1')
PY