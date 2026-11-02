/* Form liên hệ — gửi qua FormSubmit (AJAX), có chặn spam bằng bẫy ẩn. Không phụ thuộc thư viện. */
(function () {
  'use strict';
  var form = document.getElementById('farm-contact-form');
  if (!form) return;
  var status = document.getElementById('contact-form-status');
  var submit = form.querySelector('[type=submit]');
  var ENDPOINT = 'https://formsubmit.co/ajax/kieumanh2211@gmail.com';
  var busy = false;

  function say(text, bad) {
    status.textContent = text;
    status.classList.toggle('is-error', !!bad);
  }

  /* Mở từ nút “Hỏi mình” ở Cửa hàng: ?mon=Cà+tím */
  var params = new URLSearchParams(location.search);
  var mon = (params.get('mon') || '').slice(0, 80);
  if (mon) {
    var topic = form.querySelector('input[name=topic][value="Nông sản theo mùa"]');
    var msg = document.getElementById('contact-message');
    if (topic) topic.checked = true;
    if (msg && !msg.value) msg.value = 'Mình muốn hỏi về: ' + mon + '. Hiện vườn còn không, giá và cách nhận thế nào ạ?';
  }
  /* Mở từ các nút CTA cuối trang: ?chu-de=ghe-tham|nong-san|tinh-nguyen|dong-hanh|hoi-ve-vuon và ?bai=Tên+bài */
  var TOPICS = { 'ghe-tham': 'Ghé thăm khu vườn', 'nong-san': 'Nông sản theo mùa', 'tinh-nguyen': 'Làm tình nguyện',
                 'dong-hanh': 'Kết nối và đồng hành', 'hoi-ve-vuon': 'Câu hỏi về vườn hoặc bài viết', 'chao-hoi': 'Chỉ chào hỏi' };
  var chuDe = TOPICS[params.get('chu-de') || ''];
  if (chuDe && !mon) {
    var chip = form.querySelector('input[name=topic][value="' + chuDe + '"]');
    if (chip) chip.checked = true;
  }
  var bai = (params.get('bai') || '').slice(0, 120);
  if (bai) {
    var msg2 = document.getElementById('contact-message');
    if (msg2 && !msg2.value) msg2.value = 'Mình vừa đọc bài “' + bai + '” và muốn hỏi: ';
  }
  if (params.get('da-gui') === '1') say('Cảm ơn bạn! Lời nhắn đã được gửi. Mình sẽ trả lời trong khoảng 2–3 ngày làm việc.');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy || !form.reportValidity()) return;
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    var reach = String(data.contact || '').trim();
    delete data.contact;
    if (reach.indexOf('@') > 0) { data.email = reach; }
    else if (reach.replace(/\D/g, '').length >= 8) { data.phone = reach; }
    else { say('Bạn nhập giúp số Zalo hoặc email để mình phản hồi nhé.', true); document.getElementById('contact-reach').focus(); return; }
    if (data._honey) { say('Cảm ơn bạn! Lời nhắn đã được gửi.'); form.reset(); return; } // bot: giả vờ thành công
    delete data._next;
    busy = true; submit.disabled = true; form.setAttribute('aria-busy', 'true');
    say('Đang gửi lời nhắn…');
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 20000);
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
      signal: ctrl.signal
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        var okFlag = res.j && (res.j.success === true || res.j.success === 'true');
        if (!res.ok || !okFlag) throw new Error('send');
        say('Cảm ơn bạn! Lời nhắn đã được gửi. Mình sẽ trả lời trong khoảng 2–3 ngày làm việc.');
        form.reset();
      })
      .catch(function (err) {
        say(err && err.name === 'AbortError'
          ? 'Chưa xác nhận được việc gửi. Bạn kiểm tra trước khi gửi lại, hoặc gọi 0935 819 090 nhé.'
          : 'Chưa gửi được lời nhắn. Bạn thử lại sau ít phút, hoặc gọi/nhắn Zalo 0935 819 090 giúp mình nhé.', true);
      })
      .then(function () {
        clearTimeout(timer);
        busy = false; submit.disabled = false; form.removeAttribute('aria-busy');
      });
  });
})();
