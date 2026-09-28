import {cp,mkdir,writeFile,readFile,rm,realpath} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
const root=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(root,'dist');
const resolved=await realpath(dist).catch(()=>dist);
if(path.dirname(resolved)!==root||path.basename(resolved)!=='dist')throw new Error('Refusing to clean a build directory outside the website.');
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
await build({entryPoints:[path.join(root,'app.js')],outdir:path.join(dist,'js'),bundle:true,splitting:true,format:'esm',target:['es2022'],minify:true,sourcemap:false,chunkNames:'[name]-[hash]',metafile:true}).then(async result=>writeFile(path.join(root,'build-meta.json'),JSON.stringify(result.metafile,null,2)));
for(const file of ['styles.css','assets'])await cp(path.join(root,file),path.join(dist,file),{recursive:true});
let html=await readFile(path.join(root,'index.html'),'utf8');
for(const file of ['js/app.js','styles.css']){const version=createHash('sha256').update(await readFile(path.join(dist,file))).digest('hex').slice(0,12);html=html.replace('./'+file,'./'+file+'?v='+version)}
await writeFile(path.join(dist,'index.html'),html);
await writeFile(path.join(dist,'.nojekyll'),'');
console.log('Built dist/ — Titanfy Edition 05, ready for static hosting.');
