import fs from 'node:fs/promises';
import path from 'node:path';
const from='2.3.4', to='2.3.5';
async function allHTML(base='.'){
  let out=[];
  for(const e of await fs.readdir(base,{withFileTypes:true})){
    if(e.name.startsWith('.')||['assets','scripts','functions','node_modules','cdn-cgi'].includes(e.name))continue;
    const name=path.join(base,e.name);
    if(e.isDirectory())out.push(...await allHTML(name));
    else if(e.isFile()&&name.endsWith('.html'))out.push(name);
  }
  return out;
}
const pages=await allHTML();
if(pages.length<16)throw Error('Site HTML is incomplete: '+pages.length);
const oldSelect='<select id="contact-topic" name="topic"><option>Ghé thăm khu vườn</option><option>Nông sản theo mùa</option><option>Chuyện làm vườn</option><option>Kết nối và đồng hành</option><option>Một lời hỏi thăm</option></select>';
const newSelect='<select id="contact-topic" name="topic"><option>Ghé thăm khu vườn</option><option>Nông sản theo mùa</option><option>Kết nối và đồng hành</option></select>';
let count=0;
for(const filename of pages){
 let html=await fs.readFile(filename,'utf8');
 if(!html.includes('?v='+from))throw Error('Unexpected version in '+filename);
 html=html.replaceAll('?v='+from,'?v='+to);
 html=html.replaceAll('phiên bản '+from,'phiên bản '+to);
 html=html.replaceAll('Lịch sử cập nhật <span class="footer-version">v'+from+'</span>','Lịch sử cập nhật <span class="footer-version">v'+to+'</span>');
 if(filename==='lien-he/index.html'){
   if(!html.includes(oldSelect))throw Error('Unexpected contact dropdown');
   html=html.replace(oldSelect,newSelect);
   if(!html.includes('id="farm-contact-form"')||!html.includes('Gửi lời nhắn'))throw Error('Contact form inadvertently changed');
   if(html.includes('<option>Chuyện làm vườn</option>')||html.includes('<option>Một lời hỏi thăm</option>'))throw Error('Removed option still present');
 }
 if(filename==='phien-ban/index.html'){
   if(!html.includes('Phiên bản hiện tại: <strong>v'+from+'</strong>'))throw Error('Current version unexpected');
   html=html.replace('Phiên bản hiện tại: <strong>v'+from+'</strong>','Phiên bản hiện tại: <strong>v'+to+'</strong>');
   const marker='<ol class="release-list">';
   if(!html.includes(marker))throw Error('Version timeline missing');
   html=html.replace(marker,marker+'<li><header><span class="release-version">v'+to+'</span><span class="small">26/10/2026</span><h2>Tinh gọn chủ đề liên hệ</h2></header><ul><li>Loại bỏ “Chuyện làm vườn” và “Một lời hỏi thăm” khỏi danh sách chủ đề trong form, giữ ba lựa chọn còn lại và toàn bộ chức năng gửi lời nhắn.</li></ul></li>');
 }
 await fs.writeFile(filename,html);
 count++;
}
console.log('PASS: '+count+' pages; three contact options; version '+to);
