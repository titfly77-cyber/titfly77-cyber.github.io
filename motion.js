import {gsap} from 'gsap';
const overlay=document.querySelector('#transition');
const group=document.querySelector('#t-group');
const bar=document.querySelector('#t-bar');
const stem=document.querySelector('#t-stem');
const site=document.querySelector('#site');
const status=document.querySelector('#entry-status');
const loader=document.querySelector('#loading-t');
let state={scale:1,h:0,v:0};
const loaderState={scale:0,rotation:-52.5};
let loaderIntro=null,loaderSpin=null,finishIntro=null,loaderReady=Promise.resolve();
function paintLoader(){loader.style.transform=`rotate(${loaderState.rotation}deg) scale(${loaderState.scale})`}
function stopLoader(){loaderIntro?.kill();loaderSpin?.kill();loaderIntro=loaderSpin=null;finishIntro?.();finishIntro=null}
function spinLoader(){loaderSpin=gsap.to(loaderState,{rotation:'+=360',duration:2.4,repeat:-1,ease:'none',onUpdate:paintLoader})}
function untilReady(promise,signal){return new Promise((resolve,reject)=>{signal.throwIfAborted();const abort=()=>reject(signal.reason);signal.addEventListener('abort',abort,{once:true});promise.then(resolve,reject).finally(()=>signal.removeEventListener('abort',abort))})}
function geometry(){const mobile=innerWidth<=760,s=mobile?Math.min(innerWidth/390,innerHeight/844):Math.min(innerWidth/1440,innerHeight/960);return mobile?[264*s,360*s,74*s,76*s]:[640*s,540*s,112*s,144*s]}
function paint(){const w=innerWidth,h=innerHeight;const [width,height,barHeight,stemWidth]=geometry();const bx=-width/2,by=-height/2;bar.setAttribute('x',bx+state.h*w);bar.setAttribute('y',by);bar.setAttribute('width',width);bar.setAttribute('height',barHeight);stem.setAttribute('x',-stemWidth/2);stem.setAttribute('y',by+barHeight-1+state.v*h);stem.setAttribute('width',stemWidth);stem.setAttribute('height',height-barHeight+1);group.setAttribute('transform',`translate(${w/2} ${h/2}) scale(${state.scale})`)}
const fullScale=()=>{const [,h,b,s]=geometry();return Math.max(innerWidth/s,innerHeight/(h-2*b))*1.2};
function lock(){overlay.hidden=false;site.inert=true;document.body.dataset.transition='true'}
function unlock(){overlay.hidden=true;site.inert=false;overlay.dataset.phase='idle';delete document.body.dataset.transition}
addEventListener('resize',paint);
export function holdTransition(reduced=false){
 stopLoader();lock();overlay.dataset.phase=reduced?'loading':'loading-gap';overlay.dataset.assetState='loading';group.style.visibility='hidden';
 loaderState.scale=reduced?1:0;loaderState.rotation=reduced?0:-52.5;paintLoader();status.hidden=false;
 status.setAttribute('aria-label','正在加载');status.querySelector('button').hidden=true;
 if(reduced){loaderReady=Promise.resolve();return}
 loaderReady=new Promise(resolve=>finishIntro=resolve);
 loaderIntro=gsap.timeline({onUpdate:paintLoader,onComplete:()=>{finishIntro?.();finishIntro=null;loaderIntro=null}})
  .call(()=>{overlay.dataset.phase='loader-in'},null,.5)
  .to(loaderState,{scale:1,duration:.7,ease:'power2.inOut'},.5)
  .to(loaderState,{rotation:0,duration:.7,ease:'power1.in'},.5)
  .call(()=>{overlay.dataset.phase=overlay.dataset.assetState==='error'?'load-error':'loading';spinLoader()},null,1.2)
  .to({},{duration:.12},1.2);
}
export async function dismissLoader(reduced,signal){
 signal.throwIfAborted();
 await untilReady(loaderReady,signal);signal.throwIfAborted();
 loaderSpin?.kill();loaderSpin=null;
 if(reduced){status.hidden=true;return}
 overlay.dataset.phase='loader-out';
 return new Promise((resolve,reject)=>{
  const cleanup=()=>signal.removeEventListener('abort',abort);
  const timeline=gsap.timeline({onUpdate:paintLoader,onComplete:()=>{cleanup();status.hidden=true;resolve()}});
  const abort=()=>{timeline.kill();cleanup();reject(signal.reason)};
  signal.addEventListener('abort',abort,{once:true});
  // Continue at the loading spin's angular speed while shrinking completely away.
  timeline.to(loaderState,{rotation:loaderState.rotation+90,duration:.6,ease:'none'},0)
   .to(loaderState,{scale:0,duration:.6,ease:'power2.inOut'},0);
 });
}
export async function enterTransition(reduced){
 if(reduced){unlock();return}
 lock();overlay.dataset.phase='entering';state={scale:1,h:1,v:1};paint();group.style.visibility='visible';
 return new Promise(resolve=>{
  gsap.timeline({onUpdate:paint,onComplete:()=>{unlock();resolve()}})
   .to(state,{h:0,duration:.7,ease:'power3.out'},0)
   .to(state,{v:0,duration:.7,ease:'power3.out'},.35)
   .to(state,{scale:fullScale(),duration:.6,ease:'expo.in'},1.55);
 });
}
export async function exitTransition(reduced){if(reduced||['loading-gap','loader-in','loading','load-error','loader-out'].includes(overlay.dataset.phase))return;lock();overlay.dataset.phase='exiting';group.style.visibility='visible';state={scale:fullScale(),h:0,v:0};paint();return new Promise(resolve=>{gsap.timeline({onUpdate:paint,onComplete:resolve}).to(state,{scale:1,duration:.68,ease:'power2.inOut'}).to(state,{h:1.1,duration:.6,ease:'power2.inOut'},.92).to(state,{v:-1.2,duration:.6,ease:'power2.inOut'},1)})}
