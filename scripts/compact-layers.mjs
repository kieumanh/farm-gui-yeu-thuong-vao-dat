import fs from "node:fs/promises";
import path from "node:path";

const original = {
  titleHigh: "Tán cao · Giữ một khoảng xanh",
  titleMiddle: "Tầng giữa · Chia sẻ ánh sáng",
  titleLow: "Sát mặt đất · Nơi sự sống bắt đầu",
  textHigh: "Cây lâu năm tạo cấu trúc cho vườn. Khoảng cách và việc tỉa tán cần được cân nhắc để các tầng dưới vẫn nhận đủ ánh sáng.",
  textMiddle: "Cây vừa tầm là nơi vườn dày nhất. Mình xen từng khóm, chừa lối đi, để mỗi cây có khoảng sống riêng mà vẫn che phủ cho nhau.",
  textLow: "Luống rau, lớp lá rụng và nền đất đỏ. Giữ mặt đất luôn có che phủ là cách mình nuôi đất trước khi nuôi cây."
};
const compact = {
  titleHigh: "Tán cao · Giữ bóng mát",
  titleMiddle: "Tầng giữa · Kết nối tán lá",
  titleLow: "Sát mặt đất · Nuôi đất sống",
  textHigh: "Cây cao điều tiết nắng và che chở những tầng cây bên dưới.",
  textMiddle: "Cây vừa tầm trồng xen, chia sẻ ánh sáng và giữ vườn xanh mát.",
  textLow: "Rau và lá mục che phủ đất, giữ ẩm và nuôi dưỡng sinh vật nhỏ."
};

function changeRequired(content, oldText, newText, file) {
  if (!content.includes(oldText)) throw Error(`Missing expected text in ${file}: ${oldText}`);
  return content.replace(oldText, newText);
}

const cssFile = "assets/style.css";
const jsFile = "assets/app.js";
const css = await fs.readFile(cssFile, "utf8");
const js = await fs.readFile(jsFile, "utf8");
const cssMarker = "/* Farm v2.2.1 · Compact layer explanation card */";
if (css.includes(cssMarker)) throw Error("Styles already updated; refusing duplicate append.");
const cssPatch = `
${cssMarker}
.layers .layer-graphic { margin-bottom: 12px; }
.layers .layer-description {
  min-height: 0;
  height: auto;
  display: grid;
  align-content: start;
  gap: 5px;
  padding: 14px 18px;
  border-radius: 16px;
}
.layers .layer-description h3 {
  margin: 0;
  font-size: clamp(1.12rem, 1.45vw, 1.32rem);
  line-height: 1.35;
}
.layers .layer-description p {
  margin: 0;
  max-width: none;
  font-size: clamp(.91rem, 1vw, .98rem);
  line-height: 1.5;
  text-wrap: pretty;
}
@media (max-width: 620px) {
  .layers .layer-graphic { margin-bottom: 10px; }
  .layers .layer-description { min-height: 0; gap: 4px; padding: 13px 15px; }
  .layers .layer-description h3 { font-size: 1.08rem; }
  .layers .layer-description p { font-size: .91rem; }
}
`;
let newJs = js;
for (const k of Object.keys(original)) newJs = changeRequired(newJs, original[k], compact[k], jsFile);

async function htmlPaths(root=".") {
  const found=[];
  for (const entry of await fs.readdir(root,{withFileTypes:true})) {
    if (entry.name.startsWith(".") || ["assets","scripts","node_modules","cdn-cgi"].includes(entry.name)) continue;
    const loc=path.join(root,entry.name);
    if(entry.isDirectory()) found.push(...await htmlPaths(loc));
    else if(entry.isFile() && entry.name.endsWith(".html")) found.push(loc);
  }
  return found;
}
const allHtml=await htmlPaths();
if(allHtml.length < 15) throw Error("Unexpected HTML page count: "+allHtml.length);
const modified=[];
for(const f of allHtml){
  let s=await fs.readFile(f,"utf8");
  s=changeRequired(s, "?v=2.2.0", "?v=2.2.1", f);
  s=s.replaceAll("?v=2.2.0","?v=2.2.1");
  s=changeRequired(s,
    'aria-label="Xem lịch sử cập nhật phiên bản 2.2.0"',
    'aria-label="Xem lịch sử cập nhật phiên bản 2.2.1"',f);
  s=changeRequired(s, ">v2.2.0</a>", ">v2.2.1</a>", f);
  if(f.replace(/^\.\//,"")==="index.html"){
    s=changeRequired(s,original.titleHigh,compact.titleHigh,f);
    s=changeRequired(s,original.textHigh,compact.textHigh,f);
  }
  if(f.endsWith(path.join("phien-ban","index.html"))){
    s=changeRequired(s,'Phiên bản hiện tại: <strong>v2.2.0</strong>',
      'Phiên bản hiện tại: <strong>v2.2.1</strong>',f);
    const marker='<ol class="release-list">';
    const release='<li><header><span class="release-version">v2.2.1</span><span class="small">26/10/2026</span><h2>Giải thích gọn hơn, đọc dễ hơn</h2></header><ul><li>Rút ngắn mô tả ba tầng cây, bỏ chiều cao tối thiểu gây khoảng trắng lớn.</li><li>Thu gọn khoảng cách và tối ưu nội dung tương tác trên desktop, tablet và mobile.</li></ul></li>';
    s=changeRequired(s,marker,marker+release,f);
  }
  modified.push([f,s]);
}
await fs.writeFile(cssFile,css+cssPatch);
await fs.writeFile(jsFile,newJs);
for(const [f,s] of modified) await fs.writeFile(f,s);
console.log("Farm v2.2.1 compact explanations applied:",modified.length,"HTML pages, CSS, JavaScript");
