import fs from "node:fs/promises";
import path from "node:path";

const version="2.3.2", prior="2.3.1";
const images=[
"01-ngoi-nha-giua-khu-vuon.webp",
"02-luong-rau-xanh-va-gian-leo.webp",
"03-bap-cai-duoi-tan-du-du.webp",
"04-buong-chuoi-giua-vuon.webp",
"nhieu-tang-la.webp"
];
for(const photo of images) {
 const stat=await fs.stat("assets/"+photo);
 if(stat.size<100000)throw Error("Missing farm photo: "+photo);
}
const page="doi-tac/index.html";
let html=await fs.readFile(page,"utf8");
if(html.includes("partner-v232"))throw Error("Page already upgraded");
const start=html.indexOf('<main id="main">'),end=html.indexOf("</main>",start);
if(start<0||end<start)throw Error("Unexpected partners main markup");

const newMain=String.raw`<main id="main" class="partner-v232">
<section class="partner-hero wrap" aria-labelledby="partner-title">
  <div class="partner-hero-text">
    <div class="eyebrow">04 / Đối tác & đồng hành</div>
    <h1 id="partner-title">Có những hạt mầm lớn lên nhờ được cùng chăm sóc.</h1>
    <p class="partner-lead">Farm Yêu Thương là một khu vườn đang được chăm sóc mỗi ngày ở Cư M’gar, Đắk Lắk. Mình tin rằng mối quan hệ bền lâu bắt đầu từ việc hiểu nhau, hiểu đất và tôn trọng nhịp sống tự nhiên.</p>
    <p>Không cần khởi đầu bằng điều gì thật lớn. Đôi khi một lần chia sẻ kinh nghiệm, một buổi quan sát luống rau hay một lời hỏi thăm đúng lúc đã đủ để gieo thêm niềm tin.</p>
    <div class="partner-links">
      <a class="button" href="#cac-huong-dong-hanh">Tìm cách đồng hành <span aria-hidden="true">↓</span></a>
      <a class="text-link" href="/nhat-ky/anh-tu-vuon/">Ghé xem album ảnh thật</a>
    </div>
  </div>
  <figure class="partner-photo partner-hero-photo">
    <img src="/assets/01-ngoi-nha-giua-khu-vuon.webp" alt="Ngôi nhà gỗ giữa vườn cây xanh tại Farm Yêu Thương" width="960" height="1280" fetchpriority="high" decoding="async">
    <figcaption>Ngôi nhà giữa khu vườn — nơi những câu chuyện giản dị bắt đầu.</figcaption>
  </figure>
</section>

<section class="partner-paths wrap" id="cac-huong-dong-hanh" aria-labelledby="partner-path-title">
 <header class="partner-heading">
   <div class="eyebrow">Ba hướng cùng vun trồng</div>
   <h2 id="partner-path-title">Mỗi người một thế mạnh, mỗi kết nối một giá trị.</h2>
   <p>Đây là những hướng kết nối đang mở để trao đổi — không phải danh sách đối tác đã ký kết. Mình muốn tìm sự phù hợp thực tế trước khi bắt đầu.</p>
 </header>
 <div class="partner-cards">
  <article class="partner-card">
   <figure class="partner-photo"><img src="/assets/02-luong-rau-xanh-va-gian-leo.webp" alt="Luống rau xanh với các giàn tre dựng giữa khu vườn" width="960" height="1280" loading="lazy" decoding="async"><figcaption>Luống rau xanh và giàn leo.</figcaption></figure>
   <div class="partner-card-body">
    <span class="partner-index">01 / HỌC VÀ LÀM</span>
    <h3>Người làm vườn & người muốn học</h3>
    <p>Kết nối với người trồng trọt, người quan tâm đất sống và những ai muốn học từ công việc thực hành.</p>
    <ul><li>Trao đổi cách che phủ đất, xen canh và chăm cây theo mùa.</li><li>Cùng ghi chép thử nghiệm, chia sẻ cả kết quả tốt và chưa tốt.</li><li>Cân nhắc các buổi gặp gỡ tại vườn khi có điều kiện phù hợp.</li></ul>
    <p class="partner-card-note">Học hai chiều, không ai phải đóng vai người biết tất cả.</p>
   </div>
  </article>
  <article class="partner-card">
   <figure class="partner-photo"><img src="/assets/03-bap-cai-duoi-tan-du-du.webp" alt="Những cây bắp cải trồng dưới tán đu đủ trên đất đỏ" width="960" height="1280" loading="lazy" decoding="async"><figcaption>Rau theo mùa và các tầng cây.</figcaption></figure>
   <div class="partner-card-body">
    <span class="partner-index">02 / THỰC PHẨM</span>
    <h3>Người quan tâm thực phẩm địa phương</h3>
    <p>Dành cho người tiêu dùng và nhóm nhỏ mong hiểu xuất xứ thực phẩm, mùa thu hoạch cùng điều kiện thực tế nơi trồng.</p>
    <ul><li>Tìm hiểu loại cây đang có và sản lượng có thể trao đổi.</li><li>Chia sẻ cách chăm vườn, nhật ký và những quan sát thực tế.</li><li>Bàn phương án kết nối vừa sức, không cam kết vượt khả năng farm.</li></ul>
    <p class="partner-card-note">Rau quả phụ thuộc mùa vụ; mọi đơn hàng hay thỏa thuận đều cần xác nhận riêng.</p>
   </div>
  </article>
  <article class="partner-card">
   <figure class="partner-photo"><img src="/assets/04-buong-chuoi-giua-vuon.webp" alt="Buồng chuối xanh cạnh nhà gỗ trong khu vườn nhiều tầng cây" width="960" height="1280" loading="lazy" decoding="async"><figcaption>Một khoảnh khắc đời thường ở vườn.</figcaption></figure>
   <div class="partner-card-body">
    <span class="partner-index">03 / CHUYỆN VƯỜN</span>
    <h3>Người kể chuyện & sáng tạo nội dung</h3>
    <p>Chào đón người viết, chụp ảnh, nghiên cứu hoặc muốn gìn giữ những câu chuyện đời sống và bài học từ đất.</p>
    <ul><li>Ghi lại sự thay đổi của cây trồng qua các mùa bằng ảnh thật.</li><li>Biến kiến thức chăm đất thành nội dung dễ đọc, có nguồn.</li><li>Xin phép rõ ràng trước khi dùng hình ảnh hoặc câu chuyện của nhau.</li></ul>
    <p class="partner-card-note">Tôn trọng bản quyền, sự riêng tư và tính xác thực của nội dung.</p>
   </div>
  </article>
 </div>
</section>

<section class="partner-exchange" aria-labelledby="partner-exchange-title">
 <div class="wrap">
  <header class="partner-heading"><div class="eyebrow">Cùng cho đi, cùng nhận lại</div><h2 id="partner-exchange-title">Mối quan hệ tốt cần sự rõ ràng từ cả hai phía.</h2><p>Thay vì nói những lời thật lớn, mình mong có thể bắt đầu bằng việc cùng hiểu mong đợi của nhau.</p></header>
  <div class="partner-exchange-grid">
   <article class="partner-exchange-card"><h3>Điều Farm có thể chia sẻ</h3><ul><li>Trải nghiệm quan sát đất, rễ cây, lớp che phủ và cây trồng trong môi trường thực tế.</li><li>Hình ảnh, câu chuyện cùng những bài học đã và đang được thử nghiệm.</li><li>Thời gian trao đổi hoặc đón tiếp khi điều kiện nhà vườn cho phép.</li></ul></article>
   <article class="partner-exchange-card"><h3>Điều mình mong từ người đồng hành</h3><ul><li>Tôn trọng thiên nhiên, người chăm vườn và những giới hạn theo mùa.</li><li>Trao đổi trước về mục tiêu, trách nhiệm, chi phí và cách phối hợp.</li><li>Ghi nhận đóng góp, giữ lời hứa và sử dụng ảnh, thông tin đúng thỏa thuận.</li></ul></article>
  </div>
 </div>
</section>

<section class="partner-process wrap" aria-labelledby="partner-process-title">
 <header class="partner-heading"><div class="eyebrow">Làm quen từng bước</div><h2 id="partner-process-title">Ba bước đơn giản để bắt đầu.</h2><p>Không có biểu mẫu phức tạp. Một cuộc trò chuyện đủ rõ ràng thường là điểm khởi đầu tốt nhất.</p></header>
 <ol class="partner-steps">
  <li><span class="partner-step-number">01</span><h3>Gửi lời chào</h3><p>Cho mình biết bạn là ai, đang quan tâm điều gì và mong muốn cùng làm gì.</p></li>
  <li><span class="partner-step-number">02</span><h3>Trao đổi khả năng</h3><p>Cùng xem thời điểm, điều kiện thực tế và cách phối hợp có phù hợp không.</p></li>
  <li><span class="partner-step-number">03</span><h3>Thử một việc nhỏ</h3><p>Bắt đầu vừa sức, quan sát kết quả và thống nhất có tiếp tục hay không.</p></li>
 </ol>
</section>

<section class="partner-philosophy wrap" aria-labelledby="partner-philosophy-title">
 <figure class="partner-photo"><img src="/assets/nhieu-tang-la.webp" alt="Nhiều tầng cây cùng phát triển trong vườn trồng xen" width="1200" height="1600" loading="lazy" decoding="async"><figcaption>Nhiều tầng cây, nhiều vai trò — một khu vườn chung.</figcaption></figure>
 <div><div class="eyebrow">Điều mình muốn giữ</div><h2 id="partner-philosophy-title">Chân thành trước, hợp tác sau.</h2><p>Không phải mọi cuộc gặp đều phải trở thành dự án. Nếu có dịp đồng hành, mình muốn cùng giữ sự minh bạch và thái độ tôn trọng đất đai, con người. Thứ mình mong gặt hái lâu dài chính là niềm tin — điều không thể thúc lớn chỉ bằng một lời quảng cáo.</p></div>
</section>

<section class="partner-contact wrap" aria-labelledby="partner-contact-title">
 <div class="partner-contact-inner">
  <div class="eyebrow">Một lời mời từ khu vườn</div>
  <h2 id="partner-contact-title">Có một ý tưởng nhỏ? Mình cùng trò chuyện nhé.</h2>
  <p>Dù bạn muốn học làm vườn, tìm hiểu rau theo mùa hay ghi lại một câu chuyện, cứ gửi lời chào và chia sẻ điều bạn đang nghĩ.</p>
  <div class="partner-links"><a class="button" href="https://www.facebook.com/le.lam.son.168217" target="_blank" rel="noopener noreferrer">Nhắn cho Sơn <span aria-hidden="true">↗</span></a><a class="partner-contact-link" href="/lien-he/">Xem các cách liên hệ khác</a></div>
 </div>
</section>
</main>`;

const css=String.raw`/* Farm Yêu Thương — Partner page v2.3.2 | No overlap, all sections in normal flow */
.partner-v232 { isolation:isolate; }
.partner-v232 *, .partner-v232 *::before, .partner-v232 *::after { box-sizing:border-box; }
.partner-v232 :is(h1,h2,h3,p,li,a,figcaption) { overflow-wrap:break-word; }
.partner-v232 :is(.partner-hero>*,.partner-card,.partner-card-body,.partner-exchange-grid>*,.partner-steps>*,.partner-philosophy>*) { min-width:0; }
.partner-v232 .partner-hero { display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:clamp(24px,5vw,64px);align-items:center;padding-block:clamp(46px,6vw,88px) clamp(56px,7vw,100px); }
.partner-v232 .partner-hero h1 {font-size:clamp(2.1rem,4.9vw,4.3rem);line-height:1.15;letter-spacing:-.022em;margin:0 0 23px;text-wrap:balance;}
.partner-v232 .partner-hero p {color:var(--ink-700);max-width:55ch;line-height:1.8;}
.partner-v232 .partner-lead {font-size:clamp(1rem,1.5vw,1.19rem);}
.partner-v232 .partner-links {display:flex;flex-wrap:wrap;align-items:center;gap:13px;margin-top:25px;}
.partner-v232 .partner-links .button {justify-content:center;white-space:normal;text-align:center;min-height:46px;}
.partner-v232 .partner-photo {margin:0;overflow:hidden;background:#eee8d6;border:1px solid #e0d5bc;border-radius:clamp(18px,2.8vw,28px);}
.partner-v232 .partner-photo img {display:block;width:100%;object-fit:cover;object-position:center 52%;}
.partner-v232 .partner-photo figcaption {display:block;padding:11px 15px 13px;font-size:.78rem;line-height:1.5;color:var(--ink-700);background:#f5f0e4;}
.partner-v232 .partner-hero-photo {box-shadow:var(--shadow-card);}
.partner-v232 .partner-hero-photo img {aspect-ratio:5/5.3;}
.partner-v232 .partner-heading {max-width:780px;margin:0 0 clamp(24px,4vw,39px);}
.partner-v232 .partner-heading h2 {font-size:clamp(1.85rem,3.6vw,2.85rem);margin:0 0 15px;text-wrap:balance;}
.partner-v232 .partner-heading p {color:var(--ink-700);font-size:1.03rem;line-height:1.8;margin:0;}
.partner-v232 .partner-paths {padding-block:clamp(48px,6vw,84px) clamp(66px,8vw,105px);border-top:1px solid #e0dfd2;}
.partner-v232 .partner-cards {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(15px,2.3vw,26px);align-items:stretch;}
.partner-v232 .partner-card {display:flex;flex-direction:column;background:#fffcf3;overflow:hidden;border:1px solid #ded9c6;border-radius:23px;box-shadow:0 8px 25px #1a32230a;}
.partner-v232 .partner-card .partner-photo {border:0;border-radius:0;}
.partner-v232 .partner-card .partner-photo img {aspect-ratio:1.27;transition:transform .35s ease;}
.partner-v232 .partner-card .partner-photo figcaption {border-bottom:1px solid #e6dfcf;}
.partner-v232 .partner-card-body {display:flex;flex:1;flex-direction:column;gap:12px;padding:clamp(20px,2.4vw,27px);}
.partner-v232 .partner-index {color:var(--basalt-700);font-size:.76rem;font-weight:750;letter-spacing:.12em;}
.partner-v232 .partner-card h3 {font-size:clamp(1.3rem,1.85vw,1.58rem);line-height:1.32;margin:0;}
.partner-v232 .partner-card p,.partner-v232 .partner-card li {color:var(--ink-700);font-size:.94rem;line-height:1.68;}
.partner-v232 .partner-card p {margin:0;}
.partner-v232 .partner-card ul {padding-left:21px;margin:0;display:grid;gap:7px;}
.partner-v232 .partner-card li::marker {color:var(--forest-600);}
.partner-v232 .partner-card .partner-card-note {margin-top:auto;border-top:1px solid #e4dcca;padding-top:13px;color:var(--basalt-700);font-size:.84rem;}
.partner-v232 .partner-exchange {background:#e9eddf;border-block:1px solid #d2dbc8;padding-block:clamp(56px,7vw,90px);}
.partner-v232 .partner-exchange-grid {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(16px,3vw,32px);align-items:stretch;}
.partner-v232 .partner-exchange-card {background:#fffdf4;border:1px solid #d6dccb;border-radius:23px;padding:clamp(22px,3vw,36px);}
.partner-v232 .partner-exchange-card h3 {font-size:clamp(1.35rem,2.4vw,1.9rem);margin:0 0 15px;}
.partner-v232 .partner-exchange-card ul {padding-left:22px;margin:0;display:grid;gap:12px;line-height:1.76;color:var(--ink-700);}
.partner-v232 .partner-process {padding-block:clamp(62px,7vw,102px);}
.partner-v232 .partner-steps {list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(16px,2vw,26px);margin:0;padding:0;}
.partner-v232 .partner-steps li {min-width:0;padding:clamp(20px,2.8vw,30px);border-radius:21px;border:1px dashed #cbc2aa;background:#fbf6e9;}
.partner-v232 .partner-step-number {display:block;font-family:var(--font-display);font-size:2rem;line-height:1.3;color:var(--basalt-700);margin-bottom:14px;}
.partner-v232 .partner-steps h3 {margin:0 0 10px;font-size:1.35rem;}
.partner-v232 .partner-steps p {margin:0;color:var(--ink-700);font-size:.94rem;line-height:1.75;}
.partner-v232 .partner-philosophy {display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(26px,5vw,66px);align-items:center;padding-block:clamp(45px,6vw,76px);border-top:1px solid #e1ddcd;}
.partner-v232 .partner-philosophy img {aspect-ratio:1.43;}
.partner-v232 .partner-philosophy h2 {font-size:clamp(1.85rem,3.2vw,2.7rem);margin:0 0 20px;}
.partner-v232 .partner-philosophy p {margin:0;color:var(--ink-700);line-height:1.8;}
.partner-v232 .partner-contact {background:var(--forest-900);color:var(--paper-50);border-radius:26px;margin-block:clamp(36px,5vw,68px) clamp(68px,7vw,96px);padding-block:clamp(50px,6vw,85px);}
.partner-v232 .partner-contact-inner {max-width:790px;margin:0 auto;padding-inline:clamp(22px,5vw,65px);text-align:center;}
.partner-v232 .partner-contact .eyebrow {color:#f4c87e;}
.partner-v232 .partner-contact h2 {color:var(--paper-50);font-size:clamp(1.88rem,3.75vw,3rem);margin:0 0 20px;text-wrap:balance;}
.partner-v232 .partner-contact p {max-width:58ch;margin:0 auto;color:#e4eadd;line-height:1.8;}
.partner-v232 .partner-contact .partner-links {justify-content:center;}
.partner-v232 .partner-contact .button {background:#f9f5e7;color:var(--forest-900);}
.partner-v232 .partner-contact-link {color:#f6d7a5;text-underline-offset:5px;padding:10px;}
@media (hover:hover) {.partner-v232 .partner-card:hover img {transform:scale(1.025);}}
@media(max-width:1000px) {
 .partner-v232 .partner-hero {grid-template-columns:minmax(0,1fr) minmax(0,.86fr);}
 .partner-v232 .partner-cards {grid-template-columns:repeat(2,minmax(0,1fr));}
 .partner-v232 .partner-card:last-child {grid-column:1/-1;display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);}
 .partner-v232 .partner-card:last-child .partner-photo {display:flex;flex-direction:column;}
 .partner-v232 .partner-card:last-child img {height:100%;min-height:250px;aspect-ratio:auto;flex:1;}
}
@media(max-width:740px) {
 .partner-v232 .partner-hero,.partner-v232 .partner-exchange-grid,.partner-v232 .partner-philosophy {grid-template-columns:minmax(0,1fr);}
 .partner-v232 .partner-hero {padding-top:38px;}
 .partner-v232 .partner-hero-photo img {aspect-ratio:5/4.2;}
 .partner-v232 .partner-cards,.partner-v232 .partner-steps {grid-template-columns:minmax(0,1fr);}
 .partner-v232 .partner-card:last-child {display:flex;grid-column:auto;}
 .partner-v232 .partner-card:last-child img {height:auto;min-height:0;aspect-ratio:1.27;}
 .partner-v232 .partner-philosophy .partner-photo {order:0;}
 .partner-v232 .partner-philosophy > div {order:1;}
 .partner-v232 .partner-contact {border-radius:21px;}
}
@media(max-width:420px) {
 .partner-v232 .partner-links {display:grid;grid-template-columns:minmax(0,1fr);gap:12px;}
 .partner-v232 .partner-links > * {text-align:center;justify-content:center;}
 .partner-v232 .partner-card-body {padding:19px;}
 .partner-v232 .partner-hero h1 {font-size:clamp(2rem,9vw,2.5rem);}
}
@media(prefers-reduced-motion:reduce) {.partner-v232 .partner-card img {transition:none;transform:none!important;}}
`;

html=html.slice(0,start)+newMain+html.slice(end+'</main>'.length);
if(!html.includes('<link rel="stylesheet" href="/assets/style.css?v=2.3.1">'))throw Error("CSS base link not found");
html=html.replace('<link rel="stylesheet" href="/assets/style.css?v=2.3.1">','<link rel="stylesheet" href="/assets/style.css?v=2.3.1"><link rel="stylesheet" href="/assets/partners-v232.css?v=2.3.2">');
html=html.replaceAll('Các hướng kết nối và đồng hành được đề xuất cho Farm Yêu Thương.','Những hướng đồng hành với Farm Yêu Thương: làm vườn, thực phẩm theo mùa và kể chuyện bằng hình ảnh thật.');
await fs.writeFile(page,html);
await fs.writeFile("assets/partners-v232.css",css);
let files=0;
async function recurse(folder="."){
 for(const ent of await fs.readdir(folder,{withFileTypes:true})){
  if(ent.name.startsWith(".")||["assets","scripts","functions","node_modules","cdn-cgi"].includes(ent.name))continue;
  const file=path.join(folder,ent.name);
  if(ent.isDirectory())await recurse(file);
  else if(ent.isFile()&&file.endsWith(".html")){
   let body=await fs.readFile(file,"utf8");
   if(!body.includes("?v=2.3.1"))throw Error("Unexpected version in "+file);
   body=body.replaceAll("?v=2.3.1","?v=2.3.2").replaceAll("phiên bản 2.3.1","phiên bản 2.3.2").replaceAll(">v2.3.1</a>",">v2.3.2</a>");
   if(file.endsWith(path.join("phien-ban","index.html"))){
    body=body.replace('Phiên bản hiện tại: <strong>v2.3.1</strong>','Phiên bản hiện tại: <strong>v2.3.2</strong>');
    const marker='<ol class="release-list">';
    if(!body.includes(marker))throw Error("Version history missing");
    body=body.replace(marker,marker+'<li><header><span class="release-version">v2.3.2</span><span class="small">26/10/2026</span><h2>Không gian đồng hành rõ ràng hơn</h2></header><ul><li>Viết lại trang Đối tác thành các mục riêng: ba hướng hợp tác, giá trị hai chiều, ba bước làm quen, nguyên tắc đồng hành và liên hệ.</li><li>Bổ sung ảnh thật từ album; chống chồng lấn và tối ưu desktop, tablet, mobile.</li></ul></li>');
   }
   await fs.writeFile(file,body);files++;
  }
 }
}
await recurse();
const finalHtml=await fs.readFile(page,"utf8");
if(!finalHtml.includes('partners-v232.css?v=2.3.2')||!finalHtml.includes('partner-card-body'))throw Error("Page content missing");
if(files<15)throw Error("Some site pages missing: "+files);
console.log("PASS: Partner v2.3.2, "+files+" pages, "+images.length+" real album images, separate responsive grids");
