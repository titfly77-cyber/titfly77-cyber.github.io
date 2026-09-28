import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, meshopt, textureCompress } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs/promises';
const root='E:/personal-resume';
await MeshoptEncoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder});
await fs.mkdir('assets/models',{recursive:true});
for(const [source,out] of [['crystal_rendered.glb','crystal-rendered.glb'],['crystal_white_model.glb','crystal-white.glb']]){
 const doc=await io.read(root+'/视频图片及相关资料/model/'+source);
 await doc.transform(dedup(),weld(),prune(),textureCompress({encoder:sharp,targetFormat:'webp',resize:[2048,2048],quality:90}),meshopt({encoder:MeshoptEncoder,level:'medium'}));
 await io.write('assets/models/'+out,doc);
 console.log(out,(await fs.stat('assets/models/'+out)).size);
}
