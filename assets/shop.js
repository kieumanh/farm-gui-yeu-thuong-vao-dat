/* Cửa hàng theo mùa — đọc danh sách từ Kho vườn, tự quay về /assets/shop-data.json nếu Kho vườn không phản hồi. Không phụ thuộc thư viện. */
(function () {
  'use strict';
  var root = document.getElementById('shop-root');
  if (!root) return;
  var V = '2.9.54';
  /* Nguồn cấp của Kho vườn. Để '' để chỉ dùng assets/shop-data.json (cần khớp với connect-src trong _headers). */
  var KHO_FEED = 'https://quan-ly-kho-hang.guiyeuthuongvaodat.com/api/shop-feed';
  var LOCAL_FEED = '/assets/shop-data.json';
  var LABEL = { 'co-hang': 'Có hàng', 'sap-co': 'Sắp có', 'tam-het': 'Tạm hết', 'cho-cap-nhat': 'Chờ cập nhật' };
  var RANK = { 'co-hang': 0, 'sap-co': 1, 'cho-cap-nhat': 2, 'tam-het': 3 };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function fmtDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
    return m ? m[3] + '/' + m[2] + '/' + m[1] : '';
  }
  function imgSrc(it) { // ảnh từ Kho vườn là địa chỉ đầy đủ; ảnh cũ là tên tệp trong assets/shop/
    var s = it.image || '';
    return /^https?:\/\//i.test(s) ? s : '/assets/shop/' + s + '?v=' + V;
  }
  function plain(s) { // bỏ dấu để tìm kiếm
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  }

  function isYearRound(it) { return plain(it.season).indexOf('quanh nam') >= 0; }

  var keep = null; /* giữ bộ lọc khi vẽ lại lần hai (dữ liệu Kho vườn đến sau) */
  function render(data) {
    var items = (data.items || []).map(function (it, i) { it._i = i; it._k = plain(it.name + ' ' + it.group + ' ' + (Array.isArray(it.keywords) ? it.keywords.join(' ') : '')); return it; });
    items.sort(function (a, b) {
      var ra = RANK[a.status] != null ? RANK[a.status] : 2, rb = RANK[b.status] != null ? RANK[b.status] : 2;
      return ra - rb || a._i - b._i;
    });
    var have = items.filter(function (i) { return i.status === 'co-hang'; }).length;
    var soon = items.filter(function (i) { return i.status === 'sap-co'; }).length;

    /* ---- dải trạng thái: đã bỏ dòng tóm tắt “Cập nhật … · N loại đang có” vì trùng với thông báo phía trên ---- */
    var status = document.getElementById('shop-status');
    status.textContent = '';
    status.hidden = true;

    /* ---- thông báo của chủ farm (viết ở Kho vườn). Chỉ dùng textContent nên chữ nhập vào không thể chèn mã. ---- */
    var an = document.getElementById('shop-announce');
    if (an) an.remove();
    var a = data.announcement;
    if (a && typeof a.message === 'string' && a.message) {
      var kind = /^(info|warn|good)$/.test(a.kind) ? a.kind : 'info';
      an = el('div', 'shop-announce kind-' + kind);
      an.id = 'shop-announce';
      an.setAttribute('role', 'status');
      an.appendChild(el('span', 'shop-announce-ico', kind === 'warn' ? '!' : kind === 'good' ? '✓' : 'i'));
      an.lastChild.setAttribute('aria-hidden', 'true');
      var abody = el('div', 'shop-announce-body');
      if (a.title) abody.appendChild(el('strong', 'shop-announce-title', String(a.title)));
      abody.appendChild(el('p', 'shop-announce-text', a.message));
      if (a.until && fmtDate(a.until)) abody.appendChild(el('small', 'shop-announce-until', 'Thông báo áp dụng đến hết ngày ' + fmtDate(a.until) + '.'));
      an.appendChild(abody);
      status.parentNode.insertBefore(an, status);
    }

    /* ---- bộ lọc ---- */
    var state = keep || { group: 'Tất cả', q: '', onlyHave: false };
    keep = state;
    var filters = document.getElementById('shop-filters');
    filters.textContent = '';
    var groups = ['Tất cả'].concat(data.groups || []);
    if (groups.indexOf(state.group) < 0) state.group = 'Tất cả';
    function countOf(g) { return items.filter(function (i) { return g === 'Tất cả' || i.group === g; }).length; }
    groups.forEach(function (g) {
      var b = el('button', 'chip', g);
      b.type = 'button';
      b.setAttribute('aria-pressed', g === state.group ? 'true' : 'false');
      b.appendChild(el('small', '', String(countOf(g))));
      b.addEventListener('click', function () {
        state.group = g;
        Array.prototype.forEach.call(filters.children, function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
        draw();
      });
      filters.appendChild(b);
    });

    var search = document.getElementById('shop-search');
    if (search) { state.q = plain(search.value.trim()); search.oninput = function () { state.q = plain(search.value.trim()); draw(); }; }
    var only = document.getElementById('shop-only-have');
    if (only) {
      only.disabled = !have && !soon;
      only.parentNode.classList.toggle('is-disabled', only.disabled);
      if (only.disabled) { only.checked = false; state.onlyHave = false; } else only.checked = state.onlyHave;
      only.onchange = function () { state.onlyHave = only.checked; draw(); };
    }

    var grid = document.getElementById('shop-grid');
    var count = document.getElementById('shop-count');
    function draw() {
      grid.textContent = '';
      var list = items.filter(function (i) {
        if (state.group !== 'Tất cả' && i.group !== state.group) return false;
        if (state.q && i._k.indexOf(state.q) < 0) return false;
        // Quanh năm nghĩa là lúc nào cũng có hàng, nên luôn tính là đang có.
        if (state.onlyHave && i.status !== 'co-hang' && i.status !== 'sap-co' && !isYearRound(i)) return false;
        return true;
      });
      count.textContent = 'Đang hiện ' + list.length + ' / ' + items.length + ' món';
      if (!list.length) {
        var empty = el('div', 'shop-empty');
        empty.appendChild(el('p', '', 'Chưa có món nào khớp. Bạn thử bỏ bớt bộ lọc, hoặc hỏi thẳng mình nhé.'));
        var ask = el('a', 'button primary', 'Nhắn cho mình'); ask.href = '/lien-he/';
        empty.appendChild(ask);
        grid.appendChild(empty);
        return;
      }
      list.forEach(function (it, n) {
        var out = it.status === 'tam-het';
        var card = el('article', 'shop-card' + (out ? ' is-out' : ''));
        var ph = el('div', 'shop-photo');
        var img = new Image();
        img.src = imgSrc(it);
        img.alt = it.alt || it.name;
        img.width = 600; img.height = 600; img.decoding = 'async';
        if (n < 4) { img.loading = 'eager'; img.fetchPriority = 'high'; } else img.loading = 'lazy';
        ph.appendChild(img);
        var st = LABEL[it.status] ? it.status : 'cho-cap-nhat';
        ph.appendChild(el('span', 'shop-chip ' + st, LABEL[st]));
        card.appendChild(ph);
        var body = el('div', 'shop-body');
        body.appendChild(el('h3', '', it.name));
        var facts = [];
        if (it.qty) facts.push(it.qty);
        if (it.price) facts.push(it.price);
        var sub = [it.season, it.note, it.description].filter(Boolean).join(' · ');
        if (facts.length) body.appendChild(el('p', 'shop-qty', facts.join(' · ')));
        body.appendChild(el('p', 'shop-meta', sub || it.group));
        card.appendChild(body);
        grid.appendChild(card);
      });
    }
    draw();
  }

  /* Tải song song: bản dự phòng ngay trên website (nhanh, có thể đã preload) và Kho vườn (mới nhất).
     Vẽ bản có trước, bản Kho vườn đến sau thì vẽ lại. Bản Kho vườn lần trước được nhớ trong trình duyệt để lần sau hiện ngay. */
  var CACHE_KEY = 'farm-shop-feed-v1';
  function getJson(url, ms, cacheMode) {
    var ctl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, ms) : null;
    return fetch(url, { cache: cacheMode, signal: ctl ? ctl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { if (!d || !Array.isArray(d.items) || !d.items.length) throw new Error('bad'); return d; })
      .then(function (d) { if (timer) clearTimeout(timer); return d; }, function (e) { if (timer) clearTimeout(timer); throw e; });
  }
  var shown = ''; /* '', 'local', 'cache' hoặc 'kho' */
  function show(d, from) {
    if (shown === 'kho') return; /* bản mới nhất đã hiện */
    if (from !== 'kho' && shown) return;
    shown = from;
    render(d);
  }
  var cached = null;
  try { cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  if (cached && Array.isArray(cached.items) && cached.items.length) show(cached, 'cache');

  var pLocal = getJson(LOCAL_FEED + '?v=' + V, 10000, 'default');
  var pKho = KHO_FEED ? getJson(KHO_FEED, 6000, 'no-cache') : Promise.reject(new Error('off'));
  pKho.then(function (d) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch (e) {}
    show(d, 'kho');
  }, function () {});
  pLocal.then(function (d) { show(d, 'local'); }, function () {});
  Promise.all([pLocal.then(function () { return 1; }, function () { return 0; }), pKho.then(function () { return 1; }, function () { return 0; })])
    .then(function (r) {
      if (!r[0] && !r[1] && !shown) {
        var st = document.getElementById('shop-status');
        st.hidden = false;
        st.textContent = 'Chưa tải được danh sách. Bạn vào trang Liên hệ để hỏi mình nhé.';
      }
    });
})();
