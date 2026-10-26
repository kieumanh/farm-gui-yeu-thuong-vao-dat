/* Farm Yêu Thương — tương tác trang */
(function () {
  'use strict';

  /* ---- Menu di động ---- */
  var menuBtn = document.querySelector('.menu-button');
  var header = document.querySelector('.site-header');
  if (menuBtn && header) {
    menuBtn.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.site-header nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('menu-open');
        menuBtn.setAttribute('aria-expanded', 'false');
    });
    });
  }

  /* ---- Khám phá các tầng vườn ---- */
  var LAYERS = [
    {
      title: 'Tán cao · Giữ một khoảng xanh',
      text: 'Cây lâu năm tạo cấu trúc cho vườn. Khoảng cách và việc tỉa tán cần được cân nhắc để các tầng dưới vẫn nhận đủ ánh sáng.'
    },
    {
      title: 'Tầng giữa · Chia sẻ ánh sáng',
      text: 'Cây vừa tầm là nơi vườn dày nhất. Mình xen từng khóm, chừa lối đi, để mỗi cây có khoảng sống riêng mà vẫn che phủ cho nhau.'
    },
    {
      title: 'Sát mặt đất · Nơi sự sống bắt đầu',
      text: 'Luống rau, lớp lá rụng và nền đất đỏ. Giữ mặt đất luôn có che phủ là cách mình nuôi đất trước khi nuôi cây.'
    }
  ];
  var layerBtns = document.querySelectorAll('.layer-buttons button');
  var layerTitle = document.querySelector('.layer-description h3');
  var layerText = document.querySelector('.layer-description p');
  var layerGraphic = document.querySelector('.layer-graphic');
  var layerControls = document.querySelectorAll('.layer-buttons [data-layer], .layer-photo-trigger');
  function selectLayer(i, replay) {
    layerControls.forEach(function(control) {
      var active = Number(control.dataset.layer) === i;
      control.classList.toggle('selected', active);
      control.setAttribute('aria-pressed', String(active));
    });
    if (layerGraphic) layerGraphic.dataset.activeLayer = String(i);
    if (LAYERS[i] && layerTitle && layerText) {
      layerTitle.textContent = LAYERS[i].title;
      layerText.textContent = LAYERS[i].text;
    }
    var photo = document.querySelector('.layer-photo-trigger[data-layer="' + i + '"] img');
    if (replay && photo && photo.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      photo.getAnimations().forEach(function(animation) { animation.cancel(); });
      photo.animate([{transform:'scale(1.07)'},{transform:'scale(1)'}], {duration:650,easing:'ease-out'});
    }
  }
  layerControls.forEach(function(control) {
    control.addEventListener('click', function() { selectLayer(Number(control.dataset.layer), true); });
    control.addEventListener('pointerenter', function(event) {
      if (event.pointerType === 'mouse') selectLayer(Number(control.dataset.layer), true);
    });
    control.addEventListener('focus', function() { selectLayer(Number(control.dataset.layer), false); });
  });

  // Gentle emphasis on headings; article body remains still for reading.
  var phrases = /đất sống|thuận tự nhiên|yêu thương|khoảng trời riêng|học từ đất|nuôi đất/gi;
  document.querySelectorAll('h1,h2,.eyebrow').forEach(function(heading) {
    var walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function(node) {
      var text=node.textContent; phrases.lastIndex=0;
      if (!phrases.test(text)) return;
      phrases.lastIndex=0;
      var fragment=document.createDocumentFragment(),last=0;
      text.replace(phrases,function(match,offset) {
        fragment.append(document.createTextNode(text.slice(last,offset)));
        var span=document.createElement('span');span.className='living-keyword';span.textContent=match;
        fragment.append(span);last=offset+match.length;return match;
      });
      fragment.append(document.createTextNode(text.slice(last)));node.replaceWith(fragment);
    });
  });
  if ('IntersectionObserver' in window) {
    var keywordObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('keyword-visible');keywordObserver.unobserve(entry.target)}})},{threshold:.7});
    document.querySelectorAll('.living-keyword').forEach(function(el){keywordObserver.observe(el)});
    var articleObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;document.querySelectorAll('.toc a').forEach(function(link){var current=link.hash==='#'+entry.target.id;link.classList.toggle('current',current);if(current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})})},{rootMargin:'-15% 0px -65% 0px',threshold:0});
    document.querySelectorAll('.article-body section[id]').forEach(function(section){articleObserver.observe(section)});
  }

  /* ---- Hiện dần khi cuộn ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ---- Nút in bài viết ---- */
  var printBtn = document.querySelector('.print-button');
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

  const search=document.querySelector('#article-search'),filters=document.querySelectorAll('[data-filter]');
  let category='all';const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
  function filter(){let count=0;document.querySelectorAll('.library-grid .story-card').forEach(card=>{const show=(category==='all'||card.dataset.category===category)&&normalize(card.textContent).includes(normalize(search?.value||''));card.hidden=!show;if(show)count++});const result=document.querySelector('#result-count');if(result)result.textContent=count+' bài đọc';const empty=document.querySelector('#empty-results');if(empty)empty.hidden=count!==0}
  search?.addEventListener('input',filter);filters.forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.filter;filters.forEach(b=>{b.classList.toggle('selected',b===btn);b.setAttribute('aria-pressed',String(b===btn))});filter()}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&header?.classList.contains('menu-open')){header.classList.remove('menu-open');menuBtn.setAttribute('aria-expanded','false');menuBtn.focus()}});
  /* ---- Năm bản quyền ---- */
  var year = document.getElementById('footer-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
