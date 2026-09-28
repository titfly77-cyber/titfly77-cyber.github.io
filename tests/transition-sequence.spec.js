import {test,expect} from '@playwright/test';

for(const [device,width,height,tWidth] of [['desktop',1440,960,640],['mobile',390,844,264]])test(`${device}: another page assembles its T after the loading T spins completely away`,async({page})=>{
 await page.setViewportSize({width,height});await page.goto('/#/contact');await expect(page.locator('#transition')).toBeHidden();
 if(device==='mobile')await page.locator('.menu-toggle').click();
 await page.evaluate(()=>{
  window.motionFrames=[];let last='',since=0,entered=false;
  function sample(now){
   const overlay=document.querySelector('#transition'),phase=overlay.dataset.phase;
   if(phase!==last){since=now;last=phase}
   // Mask definitions have no layout box; measure their live SVG geometry instead.
   const transform=document.querySelector('#t-group').transform.baseVal.consolidate()?.matrix||new DOMMatrix();
   const measure=selector=>{const el=document.querySelector(selector),point=new DOMPoint(el.x.baseVal.value,el.y.baseVal.value).matrixTransform(transform);return {x:point.x,y:point.y,width:el.width.baseVal.value*transform.a}};
   const bar=measure('#t-bar'),stem=measure('#t-stem');
   const loader=document.querySelector('#loading-t'),matrix=new DOMMatrix(getComputedStyle(loader).transform);
   window.motionFrames.push({phase,t:now-since,barX:bar.x,barW:bar.width,stemY:stem.y,scale:Math.hypot(matrix.a,matrix.b),angle:Math.atan2(matrix.b,matrix.a)*180/Math.PI,maskHidden:getComputedStyle(document.querySelector('#t-group')).visibility==='hidden',loaderHidden:document.querySelector('#entry-status').hidden,ready:!!document.querySelector('.about-portrait img')?.naturalWidth});
   if(phase==='entering')entered=true;
   if(!entered||phase!=='idle')requestAnimationFrame(sample);
  }
  requestAnimationFrame(sample);
 });
 await page.locator('.nav-links a[href="#/about"]').click();
 await expect(page.locator('#transition')).toBeHidden();
 const frames=await page.evaluate(()=>window.motionFrames);
 await test.info().attach('motion-frames',{body:JSON.stringify(frames),contentType:'application/json'});
 const phases=frames.map(f=>f.phase).filter((p,i,a)=>i===0||p!==a[i-1]);
 expect(phases.filter(p=>p!=='idle')).toEqual(['exiting','loading-gap','loader-in','loading','loader-out','entering']);
 const gap=frames.filter(f=>f.phase==='loading-gap');
 expect(gap.at(-1).t).toBeGreaterThanOrEqual(450);expect(gap.at(-1).t).toBeLessThan(600);
 expect(gap.every(f=>f.maskHidden&&f.scale===0)).toBe(true);
 const grow=frames.filter(f=>f.phase==='loader-in');
 expect(grow[0].scale).toBeLessThan(.02);expect(grow.at(-1).scale).toBeGreaterThan(.98);
 expect(grow.every(f=>f.scale>=0&&f.scale<=1.001&&f.maskHidden)).toBe(true);
 // A zero-scale matrix has no measurable angle; compare after the T starts appearing.
 expect(Math.abs(grow.at(-1).angle-grow.find(f=>f.scale>.01).angle)).toBeGreaterThan(35);
 const shrink=frames.filter(f=>f.phase==='loader-out');expect(shrink.length).toBeGreaterThan(4);
 expect(shrink.every(f=>f.maskHidden&&f.ready&&!f.loaderHidden)).toBe(true);
 expect(shrink[0].scale).toBeGreaterThan(.9);expect(shrink.at(-1).scale).toBeLessThan(.15);
 expect(Math.abs(shrink.at(-1).angle-shrink[0].angle)).toBeGreaterThan(60);
 const entry=frames.filter(f=>f.phase==='entering');const start=entry[0],horizontal=entry.find(f=>f.t>170&&f.t<310),assembled=entry.find(f=>f.t>1120&&f.t<1400);
 expect(entry.every(f=>f.loaderHidden)).toBe(true);
 expect(start.barX).toBeGreaterThan(width);expect(start.stemY).toBeGreaterThan(height);
 expect(horizontal.barX).toBeLessThan(start.barX-50);expect(Math.abs(horizontal.stemY-start.stemY)).toBeLessThan(2);
 expect(Math.abs(assembled.barX-(width-tWidth)/2)).toBeLessThan(2);expect(assembled.stemY).toBeLessThan(height/2);expect(assembled.barW).toBeCloseTo(tWidth,0);
 expect(entry.some(f=>f.t>1550&&f.barW>tWidth*1.5)).toBe(true);
 await expect(page.locator('.about-hero h1')).toBeVisible();
});

test('history can interrupt the loading T shrink without leaving a stuck overlay',async({page})=>{
 await page.goto('/#/contact');await expect(page.locator('#transition')).toBeHidden();
 await page.locator('.nav-links a[href="#/about"]').click();await expect(page.locator('#transition')).toHaveAttribute('data-phase','loader-out');
 await page.goBack({waitUntil:'domcontentloaded'});await expect(page).toHaveURL(/#\/contact$/);await expect(page.locator('#transition')).toBeHidden();
 await page.goForward({waitUntil:'domcontentloaded'});await expect(page.locator('#transition')).toBeHidden();await expect(page.locator('.about-hero')).toBeVisible();
});

test('history can interrupt the loading T growth and restart the next entrance cleanly',async({page})=>{
 await page.goto('/#/contact');await expect(page.locator('#transition')).toBeHidden();
 await page.locator('.nav-links a[href="#/about"]').click();await expect(page.locator('#transition')).toHaveAttribute('data-phase','loader-in');
 await page.goBack({waitUntil:'domcontentloaded'});await expect(page).toHaveURL(/#\/contact$/);await expect(page.locator('#transition')).toBeHidden();
 await expect(page.locator('.contact-page')).toBeVisible();expect(await page.locator('#site').evaluate(el=>el.inert)).toBe(false);
});
