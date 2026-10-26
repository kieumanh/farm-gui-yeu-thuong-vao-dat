export const WEATHER=['sun','rain','wind'];
export const MINUTE=60000;
export function duration(rest=false,random=Math.random){return (5+random()*5)*MINUTE;}
export function startCycle(now=Date.now(),random=Math.random,previous=null){const choices=WEATHER.filter(x=>x!==previous);return {kind:choices[Math.min(choices.length-1,Math.floor(random()*choices.length))],previous,start:now,end:now+duration(false,random)};}
export function nextCycle(state,random=Math.random){return startCycle(state.end,random,state.kind);}
export function validCycle(s){return !!s&&WEATHER.includes(s.kind)&&Number.isFinite(s.start)&&Number.isFinite(s.end)&&s.end>s.start&&s.end-s.start>=5*MINUTE&&s.end-s.start<=10*MINUTE&&(s.kind!=='rest'||WEATHER.includes(s.previous));}
export function catchUp(state,now=Date.now(),random=Math.random){let s=validCycle(state)?state:startCycle(now,random);if(s.start>now||now-s.end>7*86400000)return startCycle(now,random);while(s.end<=now)s=nextCycle(s,random);return s;}
export function scrollProgress(y,total,viewport){const distance=total-viewport;return distance>0?Math.max(0,Math.min(1,y/distance)):0;}

if(typeof document!=='undefined'){
 const storage={get(k){try{return sessionStorage.getItem(k)}catch{return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch{}}};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),button=document.querySelector('#nature-toggle'),label=document.querySelector('#nature-label'),canvas=document.querySelector('#weather-canvas');
 const names={sun:'Nắng dịu',rain:'Mưa nhẹ',wind:'Gió qua vườn',rest:'Vườn lặng'};
 let cycle;try{cycle=JSON.parse(storage.get('farm-weather-v2'))}catch{}
 cycle=catchUp(cycle);let enabled=storage.get('farm-nature-enabled')!=='false',frame=0,last=0,width=0,height=0,dpr=1,points=[],ctx=canvas?.getContext('2d'),lastKind='';
 const isOn=()=>enabled&&!reduced.matches;
 function resize(){if(!canvas||!ctx)return;width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);points=Array.from({length:width<650?60:110},()=>({x:Math.random()*width,y:Math.random()*height,s:.45+Math.random(),phase:Math.random()*6.28}));}
 function draw(t){frame=0;if(!isOn()||document.hidden||cycle.kind==='rest')return;frame=requestAnimationFrame(draw);if(t-last<33)return;const dt=Math.min((t-last)/1000,.06);last=t;ctx?.clearRect(0,0,width,height);if(!ctx)return;
  for(const p of points){const rain=cycle.kind==='rain',wind=cycle.kind==='wind',sun=cycle.kind==='sun';
   p.x+=(rain?-22:wind?45:5)*p.s*dt;p.y+=(rain?240:wind?8:-6)*p.s*dt;if(p.x>width+25)p.x=-25;if(p.x<-25)p.x=width+25;if(p.y>height+25)p.y=-25;if(p.y<-25)p.y=height+25;
   if(rain){ctx.strokeStyle='rgba(60,104,128,.48)';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-5,p.y+19*p.s);ctx.stroke()}
   else if(wind){if(points.indexOf(p)>25)continue;ctx.save();ctx.translate(p.x,p.y+Math.sin(t/1700+p.phase)*30);ctx.rotate(Math.sin(t/2300+p.phase));ctx.fillStyle='rgba(95,125,57,.5)';ctx.beginPath();ctx.ellipse(0,0,9*p.s,3.8*p.s,.5,0,Math.PI*2);ctx.fill();ctx.restore()}
   else if(sun){if(points.indexOf(p)>35)continue;ctx.fillStyle='rgba(192,150,49,.44)';ctx.beginPath();ctx.arc(p.x,p.y,2.1*p.s,0,Math.PI*2);ctx.fill()}
  }
 }
 function animate(){cancelAnimationFrame(frame);frame=0;ctx?.clearRect(0,0,width,height);if(isOn()&&!document.hidden&&cycle.kind!=='rest')frame=requestAnimationFrame(draw)}
 function update(){const old=cycle.kind;cycle=catchUp(cycle);storage.set('farm-weather-v2',JSON.stringify(cycle));const on=isOn();document.body.dataset.weather=on?cycle.kind:'off';document.body.classList.toggle('nature-paused',document.hidden||!on);if(label)label.textContent=reduced.matches?'Chuyển động đã giảm':!enabled?'Hiệu ứng đang tắt':names[cycle.kind];if(button){button.setAttribute('aria-pressed',String(on));button.setAttribute('aria-label',on?'Tắt hiệu ứng thiên nhiên':'Bật hiệu ứng thiên nhiên');button.disabled=reduced.matches;button.title=reduced.matches?'Theo cài đặt giảm chuyển động của thiết bị':'Tự đổi cảnh sau 5–10 phút';}if(old!==cycle.kind||lastKind!==document.body.dataset.weather){animate();lastKind=document.body.dataset.weather}}
 button?.addEventListener('click',()=>{enabled=!enabled;storage.set('farm-nature-enabled',String(enabled));update();animate()});
 document.querySelector('#nature-next')?.addEventListener('click',()=>{if(reduced.matches)return;enabled=true;storage.set('farm-nature-enabled','true');cycle=startCycle(Date.now(),Math.random,cycle.kind==='rest'?cycle.previous:cycle.kind);update();animate()});
 reduced.addEventListener('change',()=>{update();animate()});document.addEventListener('visibilitychange',()=>{update();animate()});addEventListener('resize',()=>{resize();animate()},{passive:true});
 resize();update();animate();setInterval(update,1000);
 const stage=document.querySelector('.hero-art'),fine=matchMedia('(hover: hover) and (pointer: fine)');let pointerFrame=0;
 stage?.addEventListener('pointermove',e=>{if(!isOn()||!fine.matches)return;cancelAnimationFrame(pointerFrame);pointerFrame=requestAnimationFrame(()=>{const r=stage.getBoundingClientRect();stage.style.setProperty('--px',(((e.clientX-r.left)/r.width-.5)*12).toFixed(2)+'px');stage.style.setProperty('--py',(((e.clientY-r.top)/r.height-.5)*9).toFixed(2)+'px')})});
 stage?.addEventListener('pointerleave',()=>{cancelAnimationFrame(pointerFrame);stage.style.setProperty('--px','0px');stage.style.setProperty('--py','0px')});
 const topButton=document.querySelector('#back-to-top');let scrollFrame=0;
 function syncTop(){scrollFrame=0;if(topButton)topButton.hidden=scrollProgress(scrollY,document.documentElement.scrollHeight,innerHeight)<.2;}
 function scheduleTop(){if(!scrollFrame)scrollFrame=requestAnimationFrame(syncTop)}
 addEventListener('scroll',scheduleTop,{passive:true});addEventListener('resize',scheduleTop,{passive:true});addEventListener('load',scheduleTop,{once:true});
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(scheduleTop).observe(document.body);
 topButton?.addEventListener('click',()=>{scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});document.querySelector('.brand')?.focus({preventScroll:true})});syncTop();
}
