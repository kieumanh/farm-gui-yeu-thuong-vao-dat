import fs from "node:fs/promises";
import path from "node:path";

const FROM="2.2.2";
const TO="2.2.3";
const OLD_CSS="/assets/music-header-v222.css?v="+FROM;
const NEW_CSS="/assets/music-floating-v223.css?v="+TO;

function replaceOnce(text,needle,replacement,filename){
  if(!text.includes(needle))throw Error("Expected markup missing in "+filename+": "+needle.slice(0,90));
  return text.replace(needle,replacement);
}
async function pagesAt(root="."){
  const result=[];
  for(const entry of await fs.readdir(root,{withFileTypes:true})){
    if(entry.name.startsWith(".")||["assets","scripts","node_modules","cdn-cgi"].includes(entry.name))continue;
    const name=path.join(root,entry.name);
    if(entry.isDirectory())result.push(...await pagesAt(name));
    else if(entry.isFile()&&name.endsWith(".html"))result.push(name);
  }
  return result;
}

const pages=await pagesAt();
if(pages.length<15)throw Error("Expected full Farm website; found "+pages.length+" HTML files");
for(const file of pages){
  let html=await fs.readFile(file,"utf8");
  const opener='<div class="music-player music-player-header" id="music-player"';
  const start=html.indexOf(opener);
  const ending='</div></div>';
  const end=html.indexOf(ending,start);
  const headEnd=html.indexOf("</header>");
  if(start<0||end<0||headEnd<0||start>headEnd)throw Error("Music is not inside header in "+file);
  let music=html.slice(start,end+ending.length);
  if(!music.includes('id="music-volume"')||!music.includes('id="music-mute"')||!music.includes('id="music-panel"'))throw Error("Missing volume controls in "+file);
  music=replaceOnce(music,'class="music-player music-player-header"','class="music-player music-player-floating"',file);
  html=html.slice(0,start)+html.slice(end+ending.length);
  if(html.includes('id="music-player"'))throw Error("Duplicated music controller in "+file);
  html=replaceOnce(html,"</body>",music+"</body>",file);
  html=replaceOnce(html,OLD_CSS,NEW_CSS,file);
  html=replaceOnce(html,"?v="+FROM,"?v="+TO,file).replaceAll("?v="+FROM,"?v="+TO);
  html=replaceOnce(html,'aria-label="Xem lịch sử cập nhật phiên bản '+FROM+'"','aria-label="Xem lịch sử cập nhật phiên bản '+TO+'"',file);
  html=replaceOnce(html,">v"+FROM+"</a>",">v"+TO+"</a>",file);
  if(file.endsWith(path.join("phien-ban","index.html"))){
    html=replaceOnce(html,'Phiên bản hiện tại: <strong>v'+FROM+'</strong>','Phiên bản hiện tại: <strong>v'+TO+'</strong>',file);
    const entry='<li><header><span class="release-version">v'+TO+'</span><span class="small">26/10/2026</span><h2>Nhạc trở về vị trí cũ</h2></header><ul><li>Chuyển bộ điều khiển nhạc khỏi Header, trả không gian cho các menu tương lai.</li><li>Nút Play/Pause nhỏ gọn ở góc dưới bên trái, giữ bảng âm lượng, tắt tiếng và cài đặt đã lưu.</li><li>Điều chỉnh kích thước và vùng an toàn cho desktop, tablet, mobile.</li></ul></li>';
    html=replaceOnce(html,'<ol class="release-list">','<ol class="release-list">'+entry,file);
  }
  if((html.match(/id="music-player"/g)||[]).length!==1)throw Error("Unexpected number of music controllers in "+file);
  if(html.slice(0,html.indexOf("</header>")).includes('id="music-player"'))throw Error("Header still contains music in "+file);
  if(!html.includes("music-floating-v223.css?v="+TO))throw Error("New CSS missing in "+file);
  await fs.writeFile(file,html);
}
console.log("Farm "+TO+": music restored bottom-left on "+pages.length+" pages; menu header free.");
