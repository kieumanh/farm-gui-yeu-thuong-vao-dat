const ok=(v,status=200)=>Response.json(v,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
const isSlug=s=>/^[a-z0-9-]{1,100}$/.test(s);
export const onRequest=async ({request,env})=>{
 if(!env.DB)return ok({error:"Chưa cấu hình lưu trữ"},503);
 const url=new URL(request.url),slug=url.searchParams.get("slug")||"";
 if(!isSlug(slug))return ok({error:"Bài viết không hợp lệ"},400);
 if(request.method==="GET"){const r=await env.DB.prepare("SELECT id,name,body,created_at FROM comments WHERE slug=? AND status='approved' ORDER BY created_at DESC LIMIT 50").bind(slug).all();return ok({comments:r.results||[]});}
 if(request.method!=="POST")return ok({error:"Phương thức không hỗ trợ"},405);
 let v;try{v=await request.json()}catch{return ok({error:"Dữ liệu không hợp lệ"},400)}
 const name=String(v.name||"").trim(),email=String(v.email||"").trim(),phone=String(v.phone||"").trim(),body=String(v.body||"").trim();
 if(name.length<2||name.length>100||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>150||!/^[+0-9 .()\-]{9,18}$/.test(phone)||body.length<5||body.length>3000||v.website)return ok({error:"Vui lòng kiểm tra tên, email, số điện thoại và bình luận (5–3000 ký tự)."},400);
 const ip=request.headers.get("CF-Connecting-IP")||"unknown",bucket=Math.floor(Date.now()/3600000),digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(ip+":"+bucket));const hash=Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,"0")).join("");
 const previous=await env.DB.prepare("SELECT COUNT(*) AS n FROM comments WHERE ip_hash=? AND created_at>?").bind(hash,Date.now()-3600000).first();if((previous?.n||0)>=3)return ok({error:"Bạn đã gửi nhiều bình luận. Vui lòng thử lại sau."},429);
 await env.DB.prepare("INSERT INTO comments(id,slug,name,email,phone,body,status,created_at,ip_hash) VALUES(?,?,?,?,?,?,'pending',?,?)").bind(crypto.randomUUID(),slug,name,email,phone,body,Date.now(),hash).run();
 return ok({ok:true,message:"Bình luận đã được gửi và sẽ hiển thị sau khi duyệt."},201);
};