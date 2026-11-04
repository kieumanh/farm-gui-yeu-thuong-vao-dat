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
      title: 'Tán cao · Giữ bóng mát',
      text: 'Cây cao điều tiết nắng và che chở những tầng cây bên dưới.',
      plants: ['Chuối', 'Đu đủ', 'Bơ']
    },
    {
      title: 'Tầng giữa · Kết nối tán lá',
      text: 'Cây vừa tầm trồng xen, chia sẻ ánh sáng và giữ vườn xanh mát.',
      plants: ['Chanh dây', 'Ớt', 'Cây gia vị']
    },
    {
      title: 'Sát mặt đất · Nuôi đất sống',
      text: 'Rau và lá mục che phủ đất, giữ ẩm và nuôi dưỡng sinh vật nhỏ.',
      plants: ['Rau lá', 'Rau mùi', 'Cây phủ đất']
    }
  ];
  var layerBtns = document.querySelectorAll('.layer-buttons button');
  var layerTitle = document.querySelector('.layer-description h3');
  var layerText = document.querySelector('.layer-description p');
  var layerPlants = document.querySelector('.layer-plants');
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
      if (layerPlants) layerPlants.textContent = 'Ví dụ trong vườn: ' + LAYERS[i].plants.join(' · ');
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

  const search=document.querySelector('#article-search'),filters=document.querySelectorAll('[data-filter]');
  let category='all';const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
  const PER_PAGE=12;let page=1;const pager=document.getElementById('lib-pager'),libGrid=document.querySelector('.library-grid');
  const pageReduce=matchMedia('(prefers-reduced-motion: reduce)');
  function matchedCards(){return [...document.querySelectorAll('.library-grid .story-card')].filter(c=>!c.hidden)}
  function syncPager(){if(!pager)return;pager.querySelectorAll('.pg-num').forEach(b=>{const on=Number(b.dataset.page)===page;on?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current')})}
  function showPage(p){const list=matchedCards();const total=Math.max(1,Math.ceil(list.length/PER_PAGE));page=Math.min(Math.max(1,p),total);const from=(page-1)*PER_PAGE,to=from+PER_PAGE;document.querySelectorAll('.library-grid .story-card').forEach(c=>c.classList.remove('pg-off'));list.forEach((c,i)=>c.classList.toggle('pg-off',i<from||i>=to));syncPager()}
  function buildPager(total){if(!pager)return;pager.textContent='';if(total<=1){pager.hidden=true;return}pager.hidden=false;for(let n=1;n<=total;n++){const b=document.createElement('button');b.type='button';b.className='pg-num';b.textContent=String(n);b.dataset.page=String(n);b.setAttribute('aria-label','Trang '+n);b.addEventListener('click',()=>goTo(n,b));pager.appendChild(b)}}
  function scrollToGrid(){if(!libGrid)return;const r=libGrid.getBoundingClientRect();if(r.top<80)window.scrollTo({top:r.top+scrollY-120,behavior:pageReduce.matches?'auto':'smooth'})}
  function goTo(p,btn){if(p===page)return;if(btn&&!pageReduce.matches){btn.classList.remove('is-pressed');void btn.offsetWidth;btn.classList.add('is-pressed')}
    const apply=()=>{showPage(p);scrollToGrid()};
    if(pageReduce.matches||!libGrid){apply();return}
    libGrid.classList.add('is-turning');
    setTimeout(()=>{apply();requestAnimationFrame(()=>libGrid.classList.remove('is-turning'))},260)}
  function filter(){let count=0;document.querySelectorAll('.library-grid .story-card').forEach(card=>{const show=(category==='all'||card.dataset.category===category)&&normalize(card.textContent).includes(normalize(search?.value||''));card.hidden=!show;if(show)count++});const result=document.querySelector('#result-count');if(result)result.textContent=count+' bài đọc';const empty=document.querySelector('#empty-results');if(empty)empty.hidden=count!==0;
    const total=Math.max(1,Math.ceil(count/PER_PAGE));buildPager(total);showPage(1)}
  filter();
  search?.addEventListener('input',filter);filters.forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.filter;filters.forEach(b=>{b.classList.toggle('selected',b===btn);b.setAttribute('aria-pressed',String(b===btn))});filter()}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&header?.classList.contains('menu-open')){header.classList.remove('menu-open');menuBtn.setAttribute('aria-expanded','false');menuBtn.focus()}});
  /* ---- Năm bản quyền ---- */
  var year = document.getElementById('footer-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
