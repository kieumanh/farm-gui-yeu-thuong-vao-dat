const ORIGIN = "https://farm-yeu-thuong.kieumanh2211.chatgpt.site";
const DOMAIN = "https://le-lam-son-farm.huongthiennature.com";
export default {
 async fetch(request) {
  const incoming = new URL(request.url);
  const upstream = new URL(incoming.pathname + incoming.search, ORIGIN);
  const headers = new Headers(request.headers);
  headers.delete("host");
  const resp = await fetch(upstream.toString(), { method: request.method, headers, redirect: "follow" });
  const outHeaders = new Headers(resp.headers);
  outHeaders.delete("content-security-policy");
  outHeaders.delete("content-encoding");
  outHeaders.delete("content-length");
  outHeaders.set("x-farm-source", "ChatGPT Site v2.2.0 live upstream");
  const mime = outHeaders.get("content-type") || "";
  if (mime.includes("text/html")) {
   let html = await resp.text();
   html = html.replaceAll(ORIGIN, DOMAIN);
   return new Response(html, { status: resp.status, headers: outHeaders });
  }
  return new Response(resp.body, {status: resp.status, headers: outHeaders});
 }
};