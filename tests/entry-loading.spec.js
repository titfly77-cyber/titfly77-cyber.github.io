import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const assets=JSON.parse(readFileSync(new URL('../figma-assets.json',import.meta.url)));
const light=assets['context-0.txt'].imgSketchLightOriginalSource;
const dark=assets['context-0.txt'].imgSketchDarkRegisteredSource1;
const portrait=assets['context-1.txt'].imgPortraitWebsitePhotograph;
const gate=page=>page.locator('#transition');

test('first entry waits beyond the animation duration for both image download and SVG-layer decode',async({page})=>{
 let release;const held=new Promise(resolve=>release=resolve);
 await page.route('**/'+light,async route=>{await held;await route.continue()});
 await page.addInitScript(dark=>{
  const decode=HTMLImageElement.prototype.decode;
  HTMLImageElement.prototype.decode=async function(){await decode.call(this);if(this.src.includes(dark)){window.imageDecodeWaited=true;await new Promise(resolve=>window.finishImageDecode=resolve)}};
 },dark);
 try{
  await page.goto('/#/home',{waitUntil:'domcontentloaded'});
  await expect(gate(page)).toHaveAttribute('data-phase','loading');
  await page.waitForTimeout(2400);
  expect(await page.locator('.sketch-light').evaluate(el=>el.complete)).toBe(false);
  await expect(gate(page)).toHaveAttribute('data-phase','loading');
  await expect(page.locator('#t-group')).toHaveCSS('visibility','hidden');
  release();await expect.poll(()=>page.locator('.sketch-light').evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
  await page.waitForFunction(()=>window.imageDecodeWaited);
  await expect(gate(page)).toHaveAttribute('data-phase','loading');
  await page.evaluate(()=>window.finishImageDecode());
  await expect(gate(page)).toHaveAttribute('data-phase','entering');
  await expect(gate(page)).toBeHidden();
 }finally{release()}
});

for(const reducedMotion of ['no-preference','reduce'])test(`page navigation waits for the film poster (${reducedMotion})`,async({page})=>{
 await page.emulateMedia({reducedMotion});await page.goto('/#/contact');await expect(gate(page)).toBeHidden();
 let release;const held=new Promise(resolve=>release=resolve);
 await page.route('**/assets/covers/tea-harvesting.png',async route=>{await held;await route.continue()});
 try{
  await page.evaluate(()=>location.hash='#/film1');await expect(page.locator('body')).toHaveAttribute('data-page','film1');
  await expect(gate(page)).toHaveAttribute('data-phase','loading');await page.waitForTimeout(1000);
  await expect(gate(page)).toHaveAttribute('data-phase','loading');expect(await page.locator('#site').evaluate(el=>el.inert)).toBe(true);
  release();await expect(gate(page)).toBeHidden();
  expect(await page.locator('.film-poster').evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
  expect(await page.locator('.film-player video').evaluate(el=>el.paused&&el.currentTime===0)).toBe(true);
 }finally{release()}
});

test('failed images keep the mask closed until a successful retry',async({page})=>{
 await page.route('**/'+portrait,route=>route.abort());await page.goto('/#/about',{waitUntil:'domcontentloaded'});
 await expect(gate(page)).toHaveAttribute('data-phase','load-error');await page.waitForTimeout(2400);
 await expect(gate(page)).toHaveAttribute('data-phase','load-error');await expect(page.locator('#t-group')).toHaveCSS('visibility','hidden');
 await page.unroute('**/'+portrait);await page.getByRole('button',{name:'重新加载图片 ↻'}).click();
 await expect(gate(page)).toBeHidden();expect(await page.locator('.about-portrait img').evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
});

test('history can leave an image wait and later return without revealing an unfinished page',async({page})=>{
 await page.goto('/#/home');await expect(gate(page)).toBeHidden();
 let release;const held=new Promise(resolve=>release=resolve);
 await page.route('**/'+portrait,async route=>{await held;await route.continue()});
 try{
  await page.locator('.nav-links a[href="#/about"]').click();await expect(gate(page)).toHaveAttribute('data-phase','loading');
  await page.goBack({waitUntil:'domcontentloaded'});await expect(page).toHaveURL(/#\/home$/);await expect(gate(page)).toBeHidden();await expect(page.locator('.home-hero')).toBeVisible();
  release();await page.goForward({waitUntil:'domcontentloaded'});await expect(gate(page)).toBeHidden();await expect(page.locator('.about-hero h1')).toBeVisible();
 }finally{release()}
});
