(() => {
  const KEY = "farmAdminToken";
  const $ = (s) => document.querySelector(s);
  const loginBox = $("#login"), loginForm = $("#login-form"), tokenInput = $("#token");
  const panel = $("#panel"), list = $("#list"), statusEl = $("#status"), logoutBtn = $("#logout");
  const tabs = [...document.querySelectorAll("[data-tab]")];

  const LABELS = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Đã từ chối" };
  const ACTIONS = {
    pending: [["approve", "Duyệt", "primary"], ["reject", "Từ chối", "ghost"]],
    approved: [["reject", "Ẩn bình luận", "ghost"], ["delete", "Xóa", "danger"]],
    rejected: [["approve", "Duyệt lại", "primary"], ["delete", "Xóa", "danger"]],
  };
  const DONE = {
    approve: "Đã duyệt — bình luận đã hiển thị trên bài viết.",
    reject: "Đã chuyển bình luận vào mục từ chối.",
    delete: "Đã xóa bình luận.",
  };

  let token = "", tab = "pending", counts = {}, busy = false;

  // Mật khẩu chỉ giữ trong tab trình duyệt (tắt tab là mất), không lưu lâu dài.
  const store = {
    get() { try { return sessionStorage.getItem(KEY) || ""; } catch { return ""; } },
    set(v) { try { sessionStorage.setItem(KEY, v); } catch { /* bỏ qua */ } },
    clear() { try { sessionStorage.removeItem(KEY); } catch { /* bỏ qua */ } },
  };

  const say = (msg, bad) => {
    statusEl.textContent = msg || "";
    statusEl.classList.toggle("bad", !!bad);
  };

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text; // luôn dùng textContent: nội dung bình luận là dữ liệu từ khách
    return n;
  };

  async function api(path, opts) {
    const res = await fetch(path, {
      ...opts,
      cache: "no-store",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    });
    let data = {};
    try { data = await res.json(); } catch { /* không có nội dung JSON */ }
    if (!res.ok) {
      const err = new Error(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
      err.status = res.status;
      throw err;
    }
    return data;
  }

  const fmt = (t) => new Date(t).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });

  function renderTabs() {
    for (const b of tabs) {
      const k = b.dataset.tab;
      b.textContent = LABELS[k] + " (" + (counts[k] || 0) + ")";
      b.setAttribute("aria-pressed", String(k === tab));
    }
  }

  function renderList(items) {
    list.replaceChildren();
    if (!items.length) {
      list.append(el("p", "empty", "Không có bình luận nào trong mục này."));
      return;
    }
    for (const c of items) {
      const card = el("article", "card");
      const head = el("header", "card-head");
      head.append(el("strong", "", c.name), el("time", "", fmt(c.created_at)));
      const meta = el("p", "meta", "Bài: " + c.slug + " · " + c.email + " · " + c.phone);
      const body = el("p", "body", c.body);
      const bar = el("div", "actions");
      for (const [action, label, kind] of ACTIONS[tab]) {
        const b = el("button", "btn " + kind, label);
        b.type = "button";
        b.addEventListener("click", () => act(c.id, action));
        bar.append(b);
      }
      card.append(head, meta, body, bar);
      list.append(card);
    }
  }

  async function load() {
    const d = await api("/api/admin/comments?status=" + encodeURIComponent(tab));
    counts = d.counts || {};
    renderTabs();
    renderList(d.comments || []);
  }

  function showLogin(msg, bad) {
    panel.hidden = true;
    loginBox.hidden = false;
    tokenInput.value = "";
    say(msg, bad);
    tokenInput.focus();
  }

  function fail(e) {
    if (e.status === 401) {
      store.clear();
      token = "";
      showLogin("Mật khẩu chưa đúng. Vui lòng nhập lại.", true);
      return;
    }
    say(e.status === 503 ? e.message + ". Xem mục “Duyệt bình luận” trong README để cấu hình." : e.message, true);
  }

  async function enter(t) {
    token = t;
    busy = true;
    say("Đang tải…");
    try {
      await load();
      store.set(token);
      loginBox.hidden = true;
      panel.hidden = false;
      say("");
    } catch (e) {
      fail(e);
    } finally {
      busy = false;
    }
  }

  async function act(id, action) {
    if (busy) return;
    if (action === "delete" && !confirm("Xóa vĩnh viễn bình luận này? Không thể khôi phục.")) return;
    busy = true;
    say("Đang xử lý…");
    try {
      await api("/api/admin/comments", { method: "POST", body: JSON.stringify({ id, action }) });
      await load();
      say(DONE[action]);
    } catch (e) {
      fail(e);
    } finally {
      busy = false;
    }
  }

  for (const b of tabs) {
    b.addEventListener("click", async () => {
      if (busy) return;
      tab = b.dataset.tab;
      busy = true;
      say("Đang tải…");
      try {
        await load();
        say("");
      } catch (e) {
        fail(e);
      } finally {
        busy = false;
      }
    });
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const t = tokenInput.value.trim();
    if (t && !busy) enter(t);
  });

  logoutBtn.addEventListener("click", () => {
    store.clear();
    token = "";
    showLogin("Đã đăng xuất.");
  });

  const saved = store.get();
  if (saved) enter(saved);
})();
