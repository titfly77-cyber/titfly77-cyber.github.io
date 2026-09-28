import {gsap} from 'gsap';
const overlay=document.querySelector('#transition');
const group=document.querySelector('#t-group');
const bar=document.querySelector('#t-bar');
const stem=document.querySelector('#t-stem');
const site=document.querySelector('#site');
let state={scale:1,h:0,v:0};
function geometry(){const mobile=innerWidth<=760,s=mobile?Math.min(innerWidth/390,innerHeight/844):Math.min(innerWidth/1440,innerHeight/960);return mobile?[264*s,360*s,74*s,76*s]:[640*s,540*s,112*s,144*s]}
function paint(){const w=innerWidth,h=innerHeight;const [width,height,barHeight,stemWidth]=geometry();const bx=-width/2,by=-height/2;bar.setAttribute('x',bx+state.h*w);bar.setAttribute('y',by);bar.setAttribute('width',width);bar.setAttribute('height',barHeight);stem.setAttribute('x',-stemWidth/2);stem.setAttribute('y',by+barHeight-1+state.v*h);stem.setAttribute('width',stemWidth);stem.setAttribute('height',height-barHeight+1);group.setAttribute('transform',`translate(${w/2} ${h/2}) scale(${state.scale})`)}
const fullScale=()=>{const [,h,b,s]=geometry();return Math.max(innerWidth/s,innerHeight/(h-2*b))*1.2};
function lock(){overlay.hidden=false;site.inert=true;document.body.dataset.transition='true'}
function unlock(){overlay.hidden=true;site.inert=false;delete document.body.dataset.transition}
addEventListener('resize',paint);
export async function enterTransition(reduced,full=true){if(reduced){unlock();return}lock();return new Promise(resolve=>{state={scale:1,h:full?1:0,v:full?1:0};paint();const tl=gsap.timeline({onUpdate:paint,onComplete:()=>{unlock();resolve()}});if(full){tl.to(state,{h:0,duration:.7,ease:'power3.out'},0).to(state,{v:0,duration:.7,ease:'power3.out'},.35).to(state,{scale:fullScale(),duration:.6,ease:'expo.in'},1.55)}else tl.to(state,{scale:fullScale(),duration:.6,ease:'expo.in'});})}
export async function exitTransition(reduced){if(reduced)return;lock();state={scale:fullScale(),h:0,v:0};paint();return new Promise(resolve=>{gsap.timeline({onUpdate:paint,onComplete:resolve}).to(state,{scale:1,duration:.6,ease:'power3.inOut'}).to(state,{h:1.1,v:-1.2,duration:.6,ease:'power2.in'},.9)})}
