/* Cửa hàng theo mùa — đọc /assets/shop-data.json và dựng danh sách. Không phụ thuộc thư viện. */
(function () {
  'use strict';
  var root = document.getElementById('shop-root');
  if (!root) return;
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

  function render(data) {
    var items = (data.items || []).map(function (it, i) { it._i = i; return it; });
    items.sort(function (a, b) {
      var ra = RANK[a.status] != null ? RANK[a.status] : 2, rb = RANK[b.status] != null ? RANK[b.status] : 2;
      return ra - rb || a._i - b._i;
    });
    var have = items.filter(function (i) { return i.status === 'co-hang'; }).length;
    var soon = items.filter(function (i) { return i.status === 'sap-co'; }).length;

    var status = document.getElementById('shop-status');
    status.textContent = '';
    status.appendChild(el('span', 'pulse'));
    var when = fmtDate(data.updated);
    var line = el('span');
    if (have || soon) {
      var s = el('strong', '', 'Cập nhật ' + when);
      line.appendChild(s);
      line.appendChild(document.createTextNode(' · ' + have + ' loại đang có' + (soon ? ', ' + soon + ' loại sắp có' : '')));
    } else {
      line.appendChild(el('strong', '', 'Số lượng hôm nay chưa được cập nhật.'));
      line.appendChild(document.createTextNode(' Bạn nhắn hoặc gọi Sơn để hỏi nhé.'));
    }
    status.appendChild(line);

    var filters = document.getElementById('shop-filters');
    filters.textContent = '';
    var groups = ['Tất cả'].concat(data.groups || []);
    var current = 'Tất cả';
    groups.forEach(function (g) {
      var b = el('button', '', g);
      b.type = 'button';
      b.setAttribute('aria-pressed', g === current ? 'true' : 'false');
      b.addEventListener('click', function () {
        current = g;
        Array.prototype.forEach.call(filters.children, function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
        draw();
      });
      filters.appendChild(b);
    });

    var grid = document.getElementById('shop-grid');
    var count = document.getElementById('shop-count');
    function draw() {
      grid.textContent = '';
      var list = items.filter(function (i) { return current === 'Tất cả' || i.group === current; });
      count.textContent = list.length + ' loại';
      if (!list.length) { grid.appendChild(el('p', 'shop-empty', 'Chưa có loại nào trong nhóm này.')); return; }
      list.forEach(function (it) {
        var card = el('article', 'shop-card' + (it.status === 'tam-het' ? ' is-out' : ''));
        var ph = el('div', 'shop-photo');
        var img = new Image();
        img.src = '/assets/shop/' + it.image + '?v=2.5.0';
        img.alt = it.alt || it.name;
        img.width = 600; img.height = 600; img.loading = 'lazy'; img.decoding = 'async';
        ph.appendChild(img);
        card.appendChild(ph);
        var body = el('div', 'shop-body');
        var st = LABEL[it.status] ? it.status : 'cho-cap-nhat';
        body.appendChild(el('span', 'shop-chip ' + st, LABEL[st]));
        body.appendChild(el('h3', '', it.name));
        if (it.qty) body.appendChild(el('p', 'shop-qty', it.qty));
        var meta = [it.price, it.season, it.note].filter(Boolean).join(' · ');
        if (meta) body.appendChild(el('p', 'shop-meta', meta));
        else if (!it.qty) body.appendChild(el('p', 'shop-meta', it.group));
        card.appendChild(body);
        grid.appendChild(card);
      });
    }
    draw();
  }

  fetch('/assets/shop-data.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function () {
      var s = document.getElementById('shop-status');
      s.textContent = 'Chưa tải được danh sách. Bạn gọi hoặc nhắn Zalo cho Sơn để hỏi nhé.';
    });
})();
