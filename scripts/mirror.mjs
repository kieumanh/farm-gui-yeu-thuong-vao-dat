import fs from 'node:fs/promises';
import path from 'node:path';
const ORIGIN='https://farm-yeu-thuong.kieumanh2211.chatgpt.site';
const ROOT='site';
const queue=['/','/sitemap.xml','/robots.txt'];
const seen=new Set();
const missing=[];
const paths=[];
function local(u){const v=new URL(u,ORIGIN);if(v.origin!==ORIGIN)return null;let p=decodeURIComponent(v.pathname);if(p.endsWith('/'))p+='index.html';if(!path.posix.extname(p))p+='/index.html';if(p.includes('..'))return null;return p.slice(1);}
function scan(content,mime){const links=new Set();if(mime.includes('text/html')){for(const m of content.matchAll(/(?:src|href|poster|content)\s*=\s*["']([^"'<>]+)["']/gi))links.add(m[1]);for(const m of content.matchAll(/url\(\s*["']?([^)"']+)/gi))links.add(m[1]);for(const m of content.matchAll(/<loc>([^<]+)<\/loc>/gi))links.add(m[1]);}else if(mime.includes('css')){for(const m of content.matchAll(/url\(\s*["']?([^)"']+)/gi))links.add(m[1]);for(const m of content.matchAll(/@import\s+["']([^"']+)/gi))links.add(m[1]);}else if(mime.includes('xml')){for(const m of content.matchAll(/<loc>([^<]+)<\/loc>/gi))links.add(m[1]);}return [...links];}
while(queue.length){const item=queue.shift();let url;try{url=new URL(item,ORIGIN)}catch{continue}if(url.origin!==ORIGIN)continue;const key=url.pathname;if(seen.has(key))continue;seen.add(key);if(seen.size>700)throw Error('Too many files');const file=local(url.href);if(!file)continue;try{const res=await fetch(url,{redirect:'follow',headers:{'User-Agent':'FarmYeuThuongMirror/1.0'}});if(!res.ok)throw Error('HTTP '+res.status);let body=Buffer.from(await res.arrayBuffer());const mime=res.headers.get('content-type')||'';if(mime.includes('text/html')){let html=body.toString();html=html.replaceAll(ORIGIN,'https://le-lam-son-farm.huongthiennature.com');html=html.replace(/<script[^>]*src=["']https?:\/\/[^"']+chatgpt\.site[^"']+["'][^>]*><\/script>/g,'');body=Buffer.from(html);}else if(mime.includes('css')){body=Buffer.from(body.toString().replaceAll(ORIGIN,'https://le-lam-son-farm.huongthiennature.com'));}await fs.mkdir(path.join(ROOT,path.dirname(file)),{recursive:true});await fs.writeFile(path.join(ROOT,file),body);paths.push({file,bytes:body.length});const text=body.toString();for(const ref of scan(text,mime)){if(!ref||ref.startsWith('data:')||ref.startsWith('mailto:')||ref.startsWith('tel:')||ref.startsWith('#'))continue;try{const next=new URL(ref,url);if(next.origin===ORIGIN)queue.push(next.href)}catch{}}console.log(file,body.length)}catch(e){missing.push({url:key,error:String(e)});console.error('FAIL',key,String(e))}}
await fs.writeFile('mirror-report.json',JSON.stringify({origin:ORIGIN,downloaded:paths,missing},null,2));
const critical=['index.html','assets/style.css','assets/app.js','assets/music.mjs','assets/nature.mjs'];
for(const c of critical)if(!paths.some(p=>p.file===c))throw Error('Critical asset missing: '+c);
if(missing.length)throw Error('Mirror incomplete: '+missing.length+' resources failed');
if(paths.length<25)throw Error('Unexpectedly few files');
console.log('Validated',paths.length,'files');
