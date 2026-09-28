const status=document.querySelector('#entry-status');
const retry=status.querySelector('button');
const overlay=document.querySelector('#transition');
const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));

function firstViewAssets(root){
 return [...root.querySelectorAll('img,svg image,video[poster]')].filter(el=>{
  const rect=el.getBoundingClientRect();
  return el.getClientRects().length&&rect.width>0&&rect.bottom>=0&&rect.top<innerHeight&&rect.right>0&&rect.left<innerWidth&&getComputedStyle(el).visibility!=='hidden';
 });
}

function source(el){return el instanceof HTMLImageElement?el.currentSrc||el.src:el.localName==='video'?el.poster:el.getAttribute('href')}
function refresh(el){
 const url=new URL(source(el),location.href);url.searchParams.set('image-retry',Date.now());
 if(el instanceof HTMLImageElement)el.src=url.href;
 else if(el.localName==='video')el.poster=url.href;
 else el.setAttribute('href',url.href);
}

async function decode(el,signal){
 signal.throwIfAborted();
 const image=el instanceof HTMLImageElement?el:new Image();
 image.loading='eager';image.fetchPriority='high';
 if(image!==el)image.src=source(el);
 // Also decode SVG image layers and native video posters through the image cache.
 // A rejected load/decode never releases the entrance mask.
 await new Promise((resolve,reject)=>{
  const abort=()=>reject(signal.reason);
  signal.addEventListener('abort',abort,{once:true});
  image.decode().then(()=>image.naturalWidth?resolve():reject(new Error('Empty image')),reject).finally(()=>signal.removeEventListener('abort',abort));
 });
 signal.throwIfAborted();
}

function waitForRetry(signal){
 return new Promise((resolve,reject)=>{
  const cleanup=()=>{retry.removeEventListener('click',clicked);signal.removeEventListener('abort',aborted)};
  const clicked=()=>{cleanup();resolve()};
  const aborted=()=>{cleanup();reject(signal.reason)};
  retry.addEventListener('click',clicked,{once:true});signal.addEventListener('abort',aborted,{once:true});
 });
}

export async function waitForEntryImages(root,signal){
 const ready=new Set();
 status.setAttribute('aria-label','正在加载');retry.hidden=true;root.setAttribute('aria-busy','true');
 try{
  while(true){
   signal.throwIfAborted();
   const pending=firstViewAssets(root).filter(el=>!ready.has(el));
   if(!pending.length){await frame();signal.throwIfAborted();return}
   const result=await Promise.allSettled(pending.map(el=>decode(el,signal)));
   signal.throwIfAborted();
   const failed=[];
   result.forEach((item,i)=>item.status==='fulfilled'?ready.add(pending[i]):failed.push(pending[i]));
   if(failed.length){
    overlay.dataset.phase='load-error';status.setAttribute('aria-label','图片未加载完成，可重试');retry.hidden=false;
    await waitForRetry(signal);signal.throwIfAborted();
    retry.hidden=true;status.setAttribute('aria-label','正在加载');overlay.dataset.phase='loading';
    failed.forEach(refresh);
   }
   // Let decoded images establish their layout, then include anything newly in view.
   await frame();
  }
 }finally{retry.hidden=true;root.removeAttribute('aria-busy')}
}
