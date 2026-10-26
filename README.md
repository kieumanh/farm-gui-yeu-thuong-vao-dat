# Farm Yêu Thương — Lê Lam Sơn

**Live website:** https://le-lam-son-farm.huongthiennature.com/

**Cloudflare Pages:** `farm-gui-yeu-thuong-vao-dat.pages.dev`  
**Production branch:** `main`  
**Upstream version:** v2.2.0 (ChatGPT Site)

## Current architecture

Cloudflare Pages `_worker.js` currently acts as a **temporary reverse proxy** to `https://farm-yeu-thuong.kieumanh2211.chatgpt.site/`. HTML metadata referring to the original domain is rewritten to the new subdomain. The live content and assets are therefore still supplied by the original ChatGPT Site.

**Important:** This repository is **NOT YET** a complete source-code migration. It does not contain the newest site's HTML/CSS/JS/assets locally. If the upstream site is disabled, this proxy site may cease to function. To achieve independent hosting, export the current complete site source and assets, commit them to this repository, then replace the proxy with a static Cloudflare Pages deployment.

## Current deployment state

- GitHub ↔ Cloudflare Pages: connected with automatic deployments on `main`.
- Custom domain and HTTPS: active.
- Production verified through Cloudflare Browser Rendering.
- Source-code migration: pending.
- Do not claim v2.2.0 is independently hosted here yet.
