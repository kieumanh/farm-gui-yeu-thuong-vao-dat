export function luminance(rgb){const c=rgb.slice(0,3).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4});return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
export function safeVolume(value){const n=Number(value);return (value===null||value===''||!Number.isFinite(n)) ? 0.22 : Math.max(0,Math.min(1,n));}
if(typeof document!=='undefined'){
 const player=document.querySelector('#music-player'),audio=document.querySelector('#garden-music'),toggle=document.querySelector('#music-toggle'),volume=document.querySelector('#music-volume'),settings=document.querySelector('#music-settings'),panel=document.querySelector('#music-panel'),label=document.querySelector('#music-state'),mute=document.querySelector('#music-mute'),volumeValue=document.querySelector('#music-volume-value');
 if(player&&audio&&toggle&&volume){
 const get=(k)=>{try{return localStorage.getItem(k)}catch{return null}},set=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
 let wanted=get('farm-music-wanted')!=='false',needsGesture=false,attempt=0;
 audio.volume=safeVolume(get('farm-music-volume'));audio.muted=get('farm-music-muted')==='true';volume.value=Math.round(audio.volume*100);audio.loop=true;
 function render(){const playing=!audio.paused;toggle.setAttribute('aria-pressed',String(playing));toggle.setAttribute('aria-label',playing?'Tạm dừng nhạc nền':'Phát nhạc nền');toggle.title=playing?'Tạm dừng nhạc':'Phát nhạc';player.classList.toggle('playing',playing);label.textContent=playing?'Đang nghe':needsGesture?'Chạm để nghe':'Nhạc vườn';const displayVolume=audio.muted?0:Math.round(audio.volume*100);volume.value=displayVolume;volume.setAttribute('aria-valuetext',audio.muted?'Đã tắt tiếng':displayVolume+'%');if(volumeValue)volumeValue.textContent=displayVolume+'%';if(mute){mute.textContent=audio.muted?'Bật tiếng':'Tắt tiếng';mute.setAttribute('aria-pressed',String(audio.muted));}}
 async function play(){const current=++attempt;needsGesture=false;try{await audio.play();if(current!==attempt&&!wanted)audio.pause();if(current===attempt)needsGesture=false}catch{if(current===attempt)needsGesture=wanted}render();}
 toggle.addEventListener('click',()=>{if(wanted&&!audio.paused){wanted=false;needsGesture=false;attempt++;audio.pause();set('farm-music-wanted','false');render()}else{wanted=true;set('farm-music-wanted','true');play()}});
 volume.addEventListener('input',()=>{audio.volume=safeVolume(Number(volume.value)/100);audio.muted=false;set('farm-music-muted','false');set('farm-music-volume',String(audio.volume));render()});
 mute?.addEventListener('click',()=>{audio.muted=!audio.muted;set('farm-music-muted',String(audio.muted));render()});
 audio.addEventListener('ended',()=>{if(wanted){audio.currentTime=0;play()}});
 for(const event of ['play','pause','volumechange','ended'])audio.addEventListener(event,render);
 audio.addEventListener('error',()=>{needsGesture=false;label.textContent='Chưa tải được nhạc';toggle.title='Thử phát lại nhạc'});
 settings?.addEventListener('click',()=>{panel.hidden=!panel.hidden;settings.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)volume.focus()});
 document.addEventListener('click',e=>{if(!player.contains(e.target)){panel.hidden=true;settings?.setAttribute('aria-expanded','false')}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){panel.hidden=true;settings?.setAttribute('aria-expanded','false');settings?.focus()}});
 const resume=get('farm-music-position-near-and-far');audio.addEventListener('loadedmetadata',()=>{const time=Number(resume);if(Number.isFinite(time)&&time>0&&Number.isFinite(audio.duration))audio.currentTime=time%audio.duration},{once:true});
 let saved=0;audio.addEventListener('timeupdate',()=>{if(Date.now()-saved>3000){set('farm-music-position-near-and-far',String(audio.currentTime));saved=Date.now()}});addEventListener('pagehide',()=>set('farm-music-position-near-and-far',String(audio.currentTime)));
 function gesture(e){if(e.target?.closest?.('#music-player'))return;if(e.type==='keydown'&&!['Enter',' '].includes(e.key))return;if(wanted&&needsGesture)play()}
 document.addEventListener('pointerdown',gesture,{passive:true});document.addEventListener('keydown',gesture);
 let frame=0;
 function contrast(){frame=0;const r=player.getBoundingClientRect(),x=Math.min(innerWidth-1,r.left+25),y=Math.min(innerHeight-1,r.top+20);let rgb=[245,242,231];const elements=document.elementsFromPoint?.(x,y)||[];let target=elements.find(el=>!player.contains(el)&&!el.closest?.('.nature-atmosphere,.nature-control,#back-to-top')&&el!==document.documentElement);for(let el=target;el;el=el.parentElement){const bg=getComputedStyle(el).backgroundColor,values=bg.match(/[\d.]+/g)?.map(Number);if(values&&values.length>=3&&(values.length<4||values[3]>.75)){rgb=values;break}}player.classList.toggle('on-dark',luminance(rgb)<.27);}
 function requestContrast(){if(!frame)frame=requestAnimationFrame(contrast)}
 addEventListener('scroll',requestContrast,{passive:true});addEventListener('resize',requestContrast,{passive:true});addEventListener('load',requestContrast,{once:true});contrast();render();if(wanted)play();
 }
}
