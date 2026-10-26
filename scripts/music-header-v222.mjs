import fs from "node:fs/promises";
import path from "node:path";
const VERSION="2.2.2", PREVIOUS="2.2.1";
const fileJS="assets/music.mjs";
function replaceOnce(s,from,to,at){if(!s.includes(from))throw Error("Expected text not found in "+at+": "+from.slice(0,75));return s.replace(from,to);}
async function findPages(root="."){
 const out=[];
 for(const d of await fs.readdir(root,{withFileTypes:true})){
  if(d.name.startsWith(".")||["assets","scripts","node_modules","cdn-cgi"].includes(d.name))continue;
  const full=path.join(root,d.name);
  if(d.isDirectory())out.push(...await findPages(full));
  else if(d.isFile()&&full.endsWith(".html"))out.push(full);
 }
 return out;
}
const pages=await findPages();
if(pages.length<15)throw Error("Missing HTML pages: "+pages.length);
for(const file of pages){
 let html=await fs.readFile(file,"utf8");
 const first=html.indexOf('<div class="music-player" id="music-player">');
 const endMarker="</div></div>";
 const final=html.indexOf(endMarker,first);
 if(first<0||final<0||!html.slice(first,final).includes('id="music-volume"'))throw Error("Unexpected player markup in "+file);
 let music=html.slice(first,final+endMarker.length);
 music=replaceOnce(music,'class="music-player" id="music-player"','class="music-player music-player-header" id="music-player" role="group" aria-label="Nhạc nền Farm Yêu Thương"',file);
 music=replaceOnce(music,'id="music-state"','id="music-state" aria-live="polite"',file);
 music=replaceOnce(music,'aria-label="Chỉnh âm lượng"','aria-label="Mở tùy chỉnh âm lượng" title="Âm lượng"',file);
 music=replaceOnce(music,'class="music-panel" id="music-panel" hidden','class="music-panel" id="music-panel" role="region" aria-label="Tùy chỉnh âm lượng nhạc" hidden',file);
 music=replaceOnce(music,
   '<label for="music-volume">Âm lượng</label><input id="music-volume" type="range" min="0" max="100" value="22" step="1">',
   '<div class="music-volume-heading"><label for="music-volume">Âm lượng</label><output id="music-volume-value" for="music-volume">22%</output></div><input id="music-volume" type="range" min="0" max="100" value="22" step="1" aria-label="Âm lượng nhạc nền từ 0 đến 100 phần trăm"><button class="music-mute" id="music-mute" type="button" aria-pressed="false">Tắt tiếng</button>',
   file);
 if(!music.includes('id="music-mute"'))throw Error("Mute control not in "+file);
 html=html.slice(0,first)+html.slice(final+endMarker.length);
 html=replaceOnce(html,'<button class="menu-button"',music+'<button class="menu-button"',file);
 const hs=html.indexOf('<header class="site-header"'),he=html.indexOf('</header>',hs);
 if(hs<0||he<0||!html.slice(hs,he).includes('id="music-player"'))throw Error("Header player missing in "+file);
 html=replaceOnce(html,'</head>','<link rel="stylesheet" href="/assets/music-header-v222.css?v='+VERSION+'"></head>',file);
 html=replaceOnce(html,'?v='+PREVIOUS,'?v='+VERSION,file).replaceAll('?v='+PREVIOUS,'?v='+VERSION);
 html=replaceOnce(html,'aria-label="Xem lịch sử cập nhật phiên bản '+PREVIOUS+'"','aria-label="Xem lịch sử cập nhật phiên bản '+VERSION+'"',file);
 html=replaceOnce(html,'>v'+PREVIOUS+'</a>','>v'+VERSION+'</a>',file);
 if(file.endsWith(path.join("phien-ban","index.html"))){
  html=replaceOnce(html,'Phiên bản hiện tại: <strong>v'+PREVIOUS+'</strong>','Phiên bản hiện tại: <strong>v'+VERSION+'</strong>',file);
  const entry='<li><header><span class="release-version">v'+VERSION+'</span><span class="small">26/10/2026</span><h2>Nút nhạc gọn trong thanh điều hướng</h2></header><ul><li>Đưa Play/Pause và âm lượng lên Header ghim, không che nội dung website khi cuộn.</li><li>Điều chỉnh âm lượng 0–100%, tắt/bật tiếng và nhớ tùy chọn; tối ưu desktop, tablet và mobile.</li></ul></li>';
  html=replaceOnce(html,'<ol class="release-list">','<ol class="release-list">'+entry,file);
 }
 await fs.writeFile(file,html);
}
let src=await fs.readFile(fileJS,"utf8");
src=replaceOnce(src,
 "settings=document.querySelector('#music-settings'),panel=document.querySelector('#music-panel'),label=document.querySelector('#music-state');",
 "settings=document.querySelector('#music-settings'),panel=document.querySelector('#music-panel'),label=document.querySelector('#music-state'),mute=document.querySelector('#music-mute'),volumeValue=document.querySelector('#music-volume-value');",
 fileJS);
src=replaceOnce(src,
 "audio.volume=safeVolume(get('farm-music-volume'));volume.value=Math.round(audio.volume*100);audio.loop=true;",
 "audio.volume=safeVolume(get('farm-music-volume'));audio.muted=get('farm-music-muted')==='true';volume.value=Math.round(audio.volume*100);audio.loop=true;",
 fileJS);
src=replaceOnce(src,
 "volume.setAttribute('aria-valuetext',Math.round(audio.volume*100)+'%');",
 "const displayVolume=audio.muted?0:Math.round(audio.volume*100);volume.value=displayVolume;volume.setAttribute('aria-valuetext',audio.muted?'Đã tắt tiếng':displayVolume+'%');if(volumeValue)volumeValue.textContent=displayVolume+'%';if(mute){mute.textContent=audio.muted?'Bật tiếng':'Tắt tiếng';mute.setAttribute('aria-pressed',String(audio.muted));}",
 fileJS);
src=replaceOnce(src,
 "volume.addEventListener('input',()=>{audio.volume=safeVolume(Number(volume.value)/100);set('farm-music-volume',String(audio.volume));render()});",
 "volume.addEventListener('input',()=>{audio.volume=safeVolume(Number(volume.value)/100);audio.muted=false;set('farm-music-muted','false');set('farm-music-volume',String(audio.volume));render()});\n mute?.addEventListener('click',()=>{audio.muted=!audio.muted;set('farm-music-muted',String(audio.muted));render()});",
 fileJS);
await fs.writeFile(fileJS,src);
console.log("v"+VERSION+": "+pages.length+" HTML pages + music JS updated; panel accessible from header");
