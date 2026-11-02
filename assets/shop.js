/* Cửa hàng theo mùa — đọc /assets/shop-data.json và dựng danh sách. Không phụ thuộc thư viện. */
(function () {
  'use strict';
  var root = document.getElementById('shop-root');
  if (!root) return;
  var V = '2.6.7';
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
  function plain(s) { // bỏ dấu để tìm kiếm
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  }

  function render(data) {
    var items = (data.items || []).map(function (it, i) { it._i = i; it._k = plain(it.name + ' ' + it.group); return it; });
    items.sort(function (a, b) {
      var ra = RANK[a.status] != null ? RANK[a.status] : 2, rb = RANK[b.status] != null ? RANK[b.status] : 2;
      return ra - rb || a._i - b._i;
    });
    var have = items.filter(function (i) { return i.status === 'co-hang'; }).length;
    var soon = items.filter(function (i) { return i.status === 'sap-co'; }).length;

    /* ---- dải trạng thái ---- */
    var status = document.getElementById('shop-status');
    status.textContent = '';
    status.appendChild(el('span', 'pulse'));
    var line = el('span');
    if (have || soon) {
      line.appendChild(el('strong', '', 'Cập nhật ' + fmtDate(data.updated)));
      line.appendChild(document.createTextNode(' · ' + have + ' loại đang có' + (soon ? ', ' + soon + ' loại sắp có' : '')));
    } else {
      line.appendChild(el('strong', '', 'Số lượng hôm nay chưa được cập nhật.'));
      line.appendChild(document.createTextNode(' Bạn bấm “Hỏi mình” ở món mình thích để hỏi nhé.'));
    }
    status.appendChild(line);

    /* ---- bộ lọc ---- */
    var state = { group: 'Tất cả', q: '', onlyHave: false };
    var filters = document.getElementById('shop-filters');
    filters.textContent = '';
    var groups = ['Tất cả'].concat(data.groups || []);
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
    if (search) search.addEventListener('input', function () { state.q = plain(search.value.trim()); draw(); });
    var only = document.getElementById('shop-only-have');
    if (only) {
      only.disabled = !have && !soon;
      if (only.disabled) only.parentNode.classList.add('is-disabled');
      only.addEventListener('change', function () { state.onlyHave = only.checked; draw(); });
    }

    var grid = document.getElementById('shop-grid');
    var count = document.getElementById('shop-count');
    function draw() {
      grid.textContent = '';
      var list = items.filter(function (i) {
        if (state.group !== 'Tất cả' && i.group !== state.group) return false;
        if (state.q && i._k.indexOf(state.q) < 0) return false;
        if (state.onlyHave && i.status !== 'co-hang' && i.status !== 'sap-co') return false;
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
      list.forEach(function (it) {
        var out = it.status === 'tam-het';
        var card = el('article', 'shop-card' + (out ? ' is-out' : ''));
        var ph = el('div', 'shop-photo');
        var img = new Image();
        img.src = '/assets/shop/' + it.image + '?v=' + V;
        img.alt = it.alt || it.name;
        img.width = 600; img.height = 600; img.loading = 'lazy'; img.decoding = 'async';
        ph.appendChild(img);
        var st = LABEL[it.status] ? it.status : 'cho-cap-nhat';
        ph.appendChild(el('span', 'shop-chip ' + st, LABEL[st]));
        card.appendChild(ph);
        var body = el('div', 'shop-body');
        body.appendChild(el('h3', '', it.name));
        var facts = [];
        if (it.qty) facts.push(it.qty);
        if (it.price) facts.push(it.price);
        var sub = [it.season, it.note].filter(Boolean).join(' · ');
        if (facts.length) body.appendChild(el('p', 'shop-qty', facts.join(' · ')));
        body.appendChild(el('p', 'shop-meta', sub || it.group));
        var ask = el('a', 'shop-ask', out ? 'Hỏi khi nào có lại' : 'Hỏi mình');
        ask.href = '/lien-he/?mon=' + encodeURIComponent(it.name) + '#gui-loi-nhan';
        ask.setAttribute('aria-label', 'Hỏi mình về ' + it.name);
        ask.appendChild(el('span', '', '→'));
        ask.lastChild.setAttribute('aria-hidden', 'true');
        body.appendChild(ask);
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
      s.textContent = 'Chưa tải được danh sách. Bạn vào trang Liên hệ để hỏi mình nhé.';
    });
})();
