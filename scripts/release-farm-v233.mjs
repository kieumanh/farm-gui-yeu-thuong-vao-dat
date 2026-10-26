import fs from 'node:fs/promises';
import path from 'node:path';
const version='2.3.3';
const oldNav='<a href="/hoc-tap/">Góc học tập</a></div><div><span class="eyebrow">Giữ kết nối</span>';
const newNav='<a href="/hoc-tap/">Góc học tập</a><a class="footer-release-link" href="/phien-ban/" aria-label="Xem lịch sử cập nhật website phiên bản 2.3.3">Lịch sử cập nhật <span class="footer-version">v2.3.3</span></a></div><div><span class="eyebrow">Giữ kết nối</span>';
const oldCopyright='Farm Yêu Thương · <a href="/phien-ban/" aria-label="Xem lịch sử cập nhật phiên bản 2.3.2">v2.3.2</a>';
const must=(s,needle,file)=>{if(!s.includes(needle))throw Error('Missing '+needle.slice(0,90)+' in '+file);return s};
async function listHTML(dir='.'){
 let out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){
  if(e.name.startsWith('.')||['assets','scripts','functions','node_modules','cdn-cgi'].includes(e.name))continue;
  const full=path.join(dir,e.name);
  if(e.isDirectory())out.push(...await listHTML(full));
  else if(e.isFile()&&full.endsWith('.html'))out.push(full);
 }return out;
}
for(const name of ['02-luong-rau-xanh-va-gian-leo.webp','03-bap-cai-duoi-tan-du-du.webp']){
 const st=await fs.stat('assets/'+name);if(st.size<100000)throw Error('Missing real photo: '+name);
}
const files=await listHTML();if(files.length<16)throw Error('Too few HTML pages: '+files.length);
const prepared=[];
for(const file of files){
 let s=await fs.readFile(file,'utf8');
 must(s,oldNav,file);must(s,oldCopyright,file);
 s=s.replace(oldNav,newNav).replace(oldCopyright,'Farm Yêu Thương');
 must(s,'?v=2.3.2',file);s=s.replaceAll('?v=2.3.2','?v=2.3.3');
 if(file==='doi-tac/index.html'){
  const card1='<article class="partner-exchange-card"><h3>Điều Farm có thể chia sẻ</h3><ul>';
  const card2='<article class="partner-exchange-card"><h3>Điều mình mong từ người đồng hành</h3><ul>';
  must(s,card1,file);must(s,card2,file);
  s=s.replace(card1,'<article class="partner-exchange-card"><figure class="partner-exchange-figure"><img src="/assets/02-luong-rau-xanh-va-gian-leo.webp" alt="Luống rau xanh và giàn tre tại Farm Yêu Thương" width="960" height="1280" loading="lazy" decoding="async"><figcaption>Góc vườn để cùng học và chia sẻ kinh nghiệm.</figcaption></figure><div class="partner-exchange-copy"><h3>Điều Farm có thể chia sẻ</h3><ul>');
  s=s.replace(card2,'<article class="partner-exchange-card"><figure class="partner-exchange-figure"><img src="/assets/03-bap-cai-duoi-tan-du-du.webp" alt="Bắp cải bên cây đu đủ trên nền đất đỏ của vườn" width="960" height="1280" loading="lazy" decoding="async"><figcaption>Chăm đất, chăm cây bằng sự tôn trọng và hiểu biết.</figcaption></figure><div class="partner-exchange-copy"><h3>Điều mình mong từ người đồng hành</h3><ul>');
  for(const phrase of [
    'Thời gian trao đổi hoặc đón tiếp khi điều kiện nhà vườn cho phép.',
    'Ghi nhận đóng góp, giữ lời hứa và sử dụng ảnh, thông tin đúng thỏa thuận.'
  ]){
   const end=phrase+'</li></ul></article>';must(s,end,file);
   s=s.replace(end,phrase+'</li></ul></div></article>');
  }
  if((s.match(/class="partner-exchange-figure"/g)||[]).length!==2)throw Error('Partner image count failed');
 }
 if(file==='phien-ban/index.html'){
  const old='Phiên bản hiện tại: <strong>v2.3.2</strong>';must(s,old,file);
  s=s.replace(old,'Phiên bản hiện tại: <strong>v2.3.3</strong>');
  const marker='<ol class="release-list">';must(s,marker,file);
  s=s.replace(marker,marker+'<li><header><span class="release-version">v2.3.3</span><span class="small">26/10/2026</span><h2>Chuyển vị trí phiên bản và ảnh minh họa đối tác</h2></header><ul><li>Đưa lịch sử cập nhật và phiên bản cuối cột Dạo một vòng trên tất cả trang, bỏ thông tin lặp dưới bản quyền.</li><li>Thêm hai ảnh thật từ album vào khu vực chia sẻ và mong đợi; ảnh và chữ tách biệt, tối ưu responsive.</li></ul></li>');
 }
 if((s.match(/class="footer-release-link"/g)||[]).length!==1)throw Error('Footer count failed '+file);
 prepared.push([file,s]);
}
const globalCss='assets/style.css';let css=await fs.readFile(globalCss,'utf8');
if(css.includes('Footer navigation v2.3.3'))throw Error('Already patched');
css+='\n/* Footer navigation v2.3.3 */\n.footer-grid .footer-release-link{display:flex;align-items:center;flex-wrap:wrap;gap:8px;width:fit-content;max-width:100%;margin-top:8px;padding:7px 0;line-height:1.6;color:var(--paper-100);text-decoration:none;font-weight:550}\n.footer-grid .footer-release-link:hover{color:var(--sun-300)}\n.footer-grid .footer-version{display:inline-block;border:1px solid rgba(244,200,126,.4);border-radius:999px;padding:2px 9px;color:var(--sun-300);font-size:.77rem;font-variant-numeric:tabular-nums}\n@media(max-width:620px){.footer-grid .footer-release-link{min-height:44px;margin-top:5px}}\n';
const partnerCssFile='assets/partners-v232.css';let pc=await fs.readFile(partnerCssFile,'utf8');
if(pc.includes('Partner images v2.3.3'))throw Error('Already patched partner cards');
pc+='\n/* Partner images v2.3.3: photos above text, in normal document flow */\n.partner-v232 .partner-exchange-card{display:flex;flex-direction:column;padding:0;overflow:hidden;min-width:0}\n.partner-v232 .partner-exchange-figure{display:block;width:100%;margin:0;flex:0 0 auto;background:#e7edde;border-bottom:1px solid #d5dcc8}\n.partner-v232 .partner-exchange-figure img{display:block;width:100%;height:auto;aspect-ratio:16/8.8;object-fit:cover;object-position:center 55%}\n.partner-v232 .partner-exchange-figure figcaption{padding:10px clamp(20px,2.7vw,32px);font-size:.8rem;line-height:1.5;color:var(--forest-800);background:#f5f1e7}\n.partner-v232 .partner-exchange-copy{display:flex;flex-direction:column;flex:1 1 auto;min-width:0;padding:clamp(22px,3vw,36px)}\n.partner-v232 .partner-exchange-copy h3{line-height:1.24;margin:0 0 16px;text-wrap:balance}\n.partner-v232 .partner-exchange-copy ul{margin:0;padding-left:22px;line-height:1.72;overflow-wrap:anywhere}\n.partner-v232 .partner-exchange-grid{align-items:stretch}\n@media(max-width:740px){.partner-v232 .partner-exchange-card{border-radius:20px}.partner-v232 .partner-exchange-figure img{aspect-ratio:16/9}.partner-v232 .partner-exchange-copy{padding:22px 20px}}\n';
for(const [file,s] of prepared)await fs.writeFile(file,s);
await fs.writeFile(globalCss,css);await fs.writeFile(partnerCssFile,pc);
console.log('PASS '+version+' | '+prepared.length+' pages | 2 real partner images | footer version moved');
