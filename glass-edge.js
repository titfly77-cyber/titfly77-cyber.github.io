// Trace the union of the moving bar and stem, so their intersection has no seam.
function outline(rectangles){
 const [a,b]=rectangles;
 if(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y)return rectangles.map(r=>`M${r.x} ${r.y}h${r.w}v${r.h}h${-r.w}Z`).join('');
 const xs=[...new Set(rectangles.flatMap(r=>[r.x,r.x+r.w]))].sort((a,b)=>a-b);
 const ys=[...new Set(rectangles.flatMap(r=>[r.y,r.y+r.h]))].sort((a,b)=>a-b);
 const filled=(x,y)=>x>=0&&y>=0&&x<xs.length-1&&y<ys.length-1&&rectangles.some(r=>{const cx=(xs[x]+xs[x+1])/2,cy=(ys[y]+ys[y+1])/2;return cx>r.x&&cx<r.x+r.w&&cy>r.y&&cy<r.y+r.h});
 const edges=new Map(),key=(x,y)=>`${x},${y}`;
 const add=(x,y,nx,ny)=>edges.set(key(x,y),[nx,ny]);
 for(let y=0;y<ys.length-1;y++)for(let x=0;x<xs.length-1;x++)if(filled(x,y)){
  if(!filled(x,y-1))add(x,y,x+1,y);
  if(!filled(x+1,y))add(x+1,y,x+1,y+1);
  if(!filled(x,y+1))add(x+1,y+1,x,y+1);
  if(!filled(x-1,y))add(x,y+1,x,y);
 }
 let path='';
 while(edges.size){
  const start=edges.keys().next().value;let point=start.split(',').map(Number);
  path+=`M${xs[point[0]]} ${ys[point[1]]}`;
  while(edges.has(key(...point))){const current=key(...point),next=edges.get(current);edges.delete(current);point=next;if(key(...point)===start)break;path+=`L${xs[point[0]]} ${ys[point[1]]}`}
  path+='Z';
 }
 return path;
}

const contour=document.querySelector('#t-glass-contour');
const shadow=document.querySelector('#t-glass-shadow');
const reflection=document.querySelector('#t-glass-reflection');
export function paintGlassEdge(bar,stem,scale,w,h){
 const screen=r=>({x:w/2+r.x*scale,y:h/2+r.y*scale,w:r.w*scale,h:r.h*scale});
 contour.setAttribute('d',outline([screen(bar),screen(stem)]));
 // Keep the optical band in screen pixels as the opening grows across the viewport.
 shadow.setAttribute('width',w);shadow.setAttribute('height',h);
 reflection.setAttribute('x2',w);reflection.setAttribute('y2',h);
}
