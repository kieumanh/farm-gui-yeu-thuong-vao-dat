import fs from 'node:fs/promises';
import path from 'node:path';

const before='2.3.3', after='2.3.4', contactFile='lien-he/index.html';
function required(s,needle,where){if(!s.includes(needle))throw Error('Expected source missing in '+where+': '+needle.slice(0,90));return s;}
const phoneOld='<span class="contact-label">Điện thoại</span><a class="contact-phone" href="tel:+84935819090">0935 819 090</a><a class="contact-inline" href="tel:+84935819090">Gọi cho mình ↗</a>';
const phoneNew='<span class="contact-label">Điện thoại / Zalo</span><a class="contact-phone" href="tel:+84935819090">0935 819 090</a><div class="contact-channel-actions"><a class="contact-channel-link contact-call-link" href="tel:+84935819090" aria-label="Gọi điện cho Lê Lam Sơn qua số 0935 819 090">☎ Gọi điện ↗</a><a class="contact-channel-link contact-zalo-link" href="https://zalo.me/0935819090" target="_blank" rel="noopener noreferrer" aria-label="Mở Zalo để liên hệ số 0935 819 090">Nhắn Zalo ↗</a></div>';
let contact=await fs.readFile(contactFile,'utf8');
required(contact,phoneOld,contactFile);
contact=contact.replace(phoneOld,phoneNew);
const copyButton='<button class="contact-copy" type="button" id="contact-copy-message">Sao chép lời nhắn</button>';
required(contact,copyButton,contactFile);
contact=contact.replace(copyButton,'');
const formPhone='<label for="contact-phone">Số điện thoại <span class="optional">(không bắt buộc)</span></label><input id="contact-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="30" placeholder="Để mình liên hệ lại">';
const newFormPhone='<label for="contact-phone">Số điện thoại / Zalo <span class="optional">(không bắt buộc)</span></label><input id="contact-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="30" placeholder="Số để gọi hoặc nhắn Zalo">';
required(contact,formPhone,contactFile);contact=contact.replace(formPhone,newFormPhone);
if(contact.includes('contact-copy-message'))throw Error('Copy action remains in contact markup');
if(!contact.includes('Gửi lời nhắn'))throw Error('Contact submission missing');

// Keep the original server-side form submission exactly as it was.
const jsFile='assets/contact.js';
let contactJS=await fs.readFile(jsFile,'utf8');
const begin=contactJS.indexOf("document.querySelector('#contact-copy-message')");
const end=contactJS.indexOf("form.addEventListener('submit'",begin);
if(begin<0||end<begin)throw Error('Copy click handler not found');
contactJS=contactJS.slice(0,begin)+contactJS.slice(end);
if(contactJS.includes('navigator.clipboard')||contactJS.includes('contact-copy-message'))throw Error('Copy handler remains');
if(!contactJS.includes("form.addEventListener('submit'"))throw Error('Form submit handler lost');

// Restyle the contact channels without disturbing other components.
const cssFile='assets/style.css';
let stylesheet=await fs.readFile(cssFile,'utf8');
const cssMarker='/* Farm v2.3.4 - Phone and Zalo contact channels */';
if(stylesheet.includes(cssMarker))throw Error('Styles already patched');
stylesheet += '\n'+cssMarker+'\n'
+'.contact-channel-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:12px;min-width:0}\n'
+'.farm-contact-info .contact-channel-link{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:42px;padding:9px 14px;border-radius:999px;border:1px solid rgba(244,200,126,.48);font-size:.9rem;font-weight:650;line-height:1.35;text-align:center;text-decoration:none;color:#ffe7b4;background:rgba(255,255,255,.05);white-space:normal;transition:background .2s ease,border-color .2s ease}\n'
+'.farm-contact-info .contact-channel-link:hover,.farm-contact-info .contact-channel-link:focus-visible{color:#122b1c;background:#f8e8bb;border-color:#f8e8bb}\n'
+'.farm-contact-info .contact-zalo-link{border-color:rgba(174,217,194,.7);color:#e0f8e9;background:rgba(80,151,117,.18)}\n'
+'.farm-contact-info .contact-line>div{min-width:0}\n'
+'@media(max-width:620px){.contact-channel-actions{gap:8px}.farm-contact-info .contact-channel-link{min-height:44px;padding:10px 12px;flex:1 1 128px}.contact-channel-actions{max-width:100%}}\n'
+'@media(prefers-reduced-motion:reduce){.farm-contact-info .contact-channel-link{transition:none}}\n';

async function allHtml(root='.'){
 let out=[];
 for(const e of await fs.readdir(root,{withFileTypes:true})){
  if(e.name.startsWith('.')||['assets','scripts','functions','node_modules','cdn-cgi'].includes(e.name))continue;
  const p=path.join(root,e.name);
  if(e.isDirectory())out.push(...await allHtml(p));
  else if(e.isFile()&&p.endsWith('.html'))out.push(p);
 }
 return out;
}
const htmlFiles=await allHtml();
if(htmlFiles.length<16)throw Error('Incomplete Farm source: '+htmlFiles.length+' HTML pages');
const updated=[];
for(const file of htmlFiles){
 let html=file===contactFile?contact:await fs.readFile(file,'utf8');
 required(html,'?v='+before,file);
 html=html.replaceAll('?v='+before,'?v='+after);
 html=html.replaceAll('phiên bản '+before,'phiên bản '+after);
 // Version link is now housed in the footer navigation.
 html=html.replaceAll('Lịch sử cập nhật <span class="footer-version">v'+before+'</span>',
   'Lịch sử cập nhật <span class="footer-version">v'+after+'</span>');
 if(file==='phien-ban/index.html'){
  required(html,'Phiên bản hiện tại: <strong>v'+before+'</strong>',file);
  html=html.replace('Phiên bản hiện tại: <strong>v'+before+'</strong>',
    'Phiên bản hiện tại: <strong>v'+after+'</strong>');
  const marker='<ol class="release-list">';
  required(html,marker,file);
  const record='<li><header><span class="release-version">v'+after+'</span><span class="small">26/10/2026</span><h2>Thêm kết nối điện thoại và Zalo</h2></header><ul><li>Gỡ nút Sao chép lời nhắn và đoạn xử lý clipboard không còn cần thiết.</li><li>Bổ sung lựa chọn Gọi điện và Nhắn Zalo từ số 0935 819 090; cập nhật nhãn số điện thoại / Zalo trong form.</li><li>Tinh gọn và kiểm tra responsive; giữ nguyên chức năng gửi form liên hệ.</li></ul></li>';
  html=html.replace(marker,marker+record);
 }
 if(file===contactFile&&(html.includes('contact-copy-message')||!html.includes('zalo.me/0935819090')))throw Error('Contact HTML validation failed');
 if(!html.includes('v'+after))throw Error('Version not updated in '+file);
 updated.push([file,html]);
}
for(const [file,html] of updated)await fs.writeFile(file,html);
await fs.writeFile(jsFile,contactJS);
await fs.writeFile(cssFile,stylesheet);
console.log('SUCCESS Farm v'+after+': '+updated.length+' pages updated; old copy UI and JS removed; phone, Zalo, responsive styles installed.');
