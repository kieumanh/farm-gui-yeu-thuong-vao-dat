/* v2.8.0 — lightbox ảnh (phím ← → Esc, vuốt trên điện thoại), bộ lọc ảnh theo chủ đề */
(function () {
  'use strict';

  /* ----- Lightbox dùng <dialog>: có sẵn bẫy focus, Esc và trả focus về ảnh vừa mở ----- */
  var grids = document.querySelectorAll('.farm-photo-grid');
  if (grids.length && typeof HTMLDialogElement === 'function') {
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Xem ảnh lớn');
    dlg.innerHTML =
      '<div class="lb-stage">' +
        '<button type="button" class="lb-btn lb-prev" aria-label="Ảnh trước">‹</button>' +
        '<figure><img alt=""><figcaption></figcaption></figure>' +
        '<button type="button" class="lb-btn lb-next" aria-label="Ảnh sau">›</button>' +
      '</div>' +
      '<div class="lb-bar"><span class="lb-count" aria-live="polite"></span>' +
        '<button type="button" class="lb-btn lb-close">Đóng</button></div>';
    document.body.appendChild(dlg);

    var img = dlg.querySelector('img');
    var cap = dlg.querySelector('figcaption');
    var count = dlg.querySelector('.lb-count');
    var items = [];
    var idx = 0;
    var opener = null;

    function visibleLinks(grid) {
      return Array.prototype.slice.call(grid.querySelectorAll('figure:not([hidden]) > a[href]'));
    }
    function show(i) {
      if (!items.length) return;
      idx = (i + items.length) % items.length;
      var a = items[idx];
      var fig = a.closest('figure');
      var thumb = fig && fig.querySelector('img');
      img.src = a.getAttribute('href');
      img.alt = thumb ? thumb.getAttribute('alt') || '' : '';
      var c = fig && fig.querySelector('figcaption');
      cap.textContent = c ? c.textContent : img.alt;
      count.textContent = (idx + 1) + ' / ' + items.length;
    }
    function open(a) {
      items = visibleLinks(a.closest('.farm-photo-grid'));
      opener = a;
      show(items.indexOf(a));
      dlg.showModal();
    }

    grids.forEach(function (grid) {
      grid.addEventListener('click', function (e) {
        var a = e.target.closest('a[href]');
        if (!a || !grid.contains(a) || !/\.(webp|jpe?g|png)(\?|$)/i.test(a.getAttribute('href'))) return;
        e.preventDefault();
        open(a);
      });
    });

    dlg.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    dlg.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { if (opener) opener.focus(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
    });

    var sx = null;
    dlg.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      sx = null;
      if (Math.abs(dx) > 40) show(dx < 0 ? idx + 1 : idx - 1);
    });
  }

  /* ----- Bộ lọc ảnh (trang chủ) ----- */
  var bar = document.querySelector('.gallery-filters');
  if (bar) {
    var section = bar.closest('section');
    var figs = section ? section.querySelectorAll('.farm-photo-grid figure') : [];
    var empty = section ? section.querySelector('.gallery-empty') : null;
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      var f = btn.getAttribute('data-filter');
      Array.prototype.forEach.call(bar.querySelectorAll('button'), function (b) {
        var on = b === btn;
        b.classList.toggle('selected', on);
        b.setAttribute('aria-pressed', String(on));
      });
      var shown = 0;
      Array.prototype.forEach.call(figs, function (fig) {
        var tags = (fig.getAttribute('data-tags') || '').split(',');
        var match = f === 'all' || tags.indexOf(f) !== -1;
        fig.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }
})();

/* v2.9.56: từ 940px trở xuống (điện thoại, máy tính bảng), nút nhạc và nút hiệu ứng chuyển vào cuối thanh menu; trên máy tính vẫn nằm góc dưới */
(function () {
  'use strict';
  var nav = document.getElementById('navigation');
  var nature = document.querySelector('.nature-control');
  var music = document.getElementById('music-player');
  if (!nav || (!nature && !music)) return;
  var mq = window.matchMedia('(max-width: 940px)');
  var dock = null;
  function place() {
    if (mq.matches) {
      if (!dock) {
        dock = document.createElement('div');
        dock.className = 'menu-dock';
        dock.setAttribute('role', 'group');
        dock.setAttribute('aria-label', 'Nhạc nền và hiệu ứng');
      }
      if (music) dock.appendChild(music);
      if (nature) dock.appendChild(nature);
      nav.appendChild(dock);
    } else {
      if (music) document.body.appendChild(music);
      if (nature) document.body.appendChild(nature);
      if (dock && dock.parentNode) dock.parentNode.removeChild(dock);
    }
  }
  if (mq.addEventListener) mq.addEventListener('change', place); else mq.addListener(place);
  place();
})();
