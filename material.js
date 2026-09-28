import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {MeshSurfaceSampler} from 'three/addons/math/MeshSurfaceSampler.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
export async function mountMaterial(host,reduce){
 if(!host)return()=>{};
 const section=host.closest('.material-story');const status=host.querySelector('.model-status');let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'})}catch{status.textContent='产品展示';section.dataset.fallback='true';return()=>{}}
 let disposed=false,frame=0,visible=false,loaded=false,time=0,last=0,progress=0,shown=0,pointerX=0,pointerY=0;
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.5:2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.setClearColor(0xf5f5f7,0);host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,1,.05,80);camera.position.set(0,1.25,7.5);
 const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 const hemisphere=new THREE.HemisphereLight(0xffffff,0x99a7c4,2);scene.add(hemisphere);
 const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(3,5,4);scene.add(key);
 const rim=new THREE.DirectionalLight(0xa99dff,2);rim.position.set(-3,2,-4);scene.add(rim);
 const fill=new THREE.PointLight(0xb8c8ff,8,10);fill.position.set(-2,0,3);scene.add(fill);
 const modelGroup=new THREE.Group();scene.add(modelGroup);const meshes=[];const materials=[];let points,pointMaterial,pointGeometry;
 const reveal={value:0};const shaderPrefix='varying vec3 vRevealPosition; uniform float uReveal;';
 function materialize(material){const m=material.clone();m.transparent=true;m.depthWrite=true;
 m.onBeforeCompile=shader=>{shader.uniforms.uReveal=reveal;shader.vertexShader='varying vec3 vRevealPosition;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvRevealPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;');shader.fragmentShader=shaderPrefix+'\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <lights_physical_fragment>',`
 float grain = sin(vRevealPosition.x*33.0+sin(vRevealPosition.z*29.0))*sin(vRevealPosition.y*27.0)*0.055;
 float field = clamp((1.5-vRevealPosition.y)/3.0 + grain + sin(vRevealPosition.x*4.0+vRevealPosition.z*6.0)*0.08,0.01,0.99);
 float generated = smoothstep(field-0.075,field+0.075,(uReveal-0.49)/0.33);
 if(uReveal>0.83) generated=1.0;
 float contour = pow(1.0-abs(dot(normalize(normal),normalize(vViewPosition))),3.0);
 vec3 cadColor = mix(vec3(0.72,0.75,0.81),vec3(0.35,0.4,0.5),contour*0.6);
 diffuseColor.rgb = mix(cadColor,diffuseColor.rgb,generated);
 diffuseColor.a = mix(0.5,diffuseColor.a,generated);
 roughnessFactor = mix(0.72,roughnessFactor,generated);
 metalnessFactor = mix(0.04,metalnessFactor,generated);
 totalEmissiveRadiance *= generated;
 float frontier = (1.0-abs(generated*2.0-1.0))*0.15;
 totalEmissiveRadiance += vec3(0.36,0.2,0.8)*frontier;
 #include <lights_physical_fragment>`)};
 m.customProgramCacheKey=()=> 'titanfy-matter-v1';materials.push(m);return m}
 function resize(){if(disposed)return;const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 const ro=new ResizeObserver(resize);ro.observe(host);resize();
 const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start();else{cancelAnimationFrame(frame);frame=0}},{rootMargin:'300px'});io.observe(section);
 function onPointer(ev){const r=host.getBoundingClientRect();pointerX=clamp((ev.clientX-r.left)/r.width*2-1,-1,1);pointerY=clamp((ev.clientY-r.top)/r.height*2-1,-1,1)}
 function leave(){pointerX=pointerY=0}
 host.addEventListener('pointermove',onPointer);host.addEventListener('pointerleave',leave);
 const replay=section.querySelector('#replay-model');replay.onclick=()=>section.scrollIntoView({behavior:reduce.matches?'instant':'smooth'});
 function scroll(){const rect=section.getBoundingClientRect();progress=reduce.matches?1:clamp(-rect.top/(section.offsetHeight-innerHeight));section.dataset.progress=progress.toFixed(3);section.querySelector('.material-progress span').style.width=progress*100+'%';const labels=['01 / 数字原型','02 / 粒子唤醒','03 / 结构生成','04 / 完整产品'];section.querySelector('#material-state').textContent=labels[progress<.2?0:progress<.5?1:progress<.8?2:3];if(loaded){if(reduce.matches){shown=1;reveal.value=1;render(0)}else start()}}
 addEventListener('scroll',scroll,{passive:true});reduce.addEventListener('change',scroll);scroll();
 const changeVisibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else start()};document.addEventListener('visibilitychange',changeVisibility);
 function render(dt){shown+=(progress-shown)*(1-Math.exp(-dt*12));if(reduce.matches)shown=1;reveal.value=shown;key.intensity=.65+shown*3.35;hemisphere.intensity=.8+shown*1.2;rim.intensity=.4+shown*1.6;fill.intensity=1+shown*7;scene.environmentIntensity=.3+shown*.7;renderer.toneMappingExposure=.85+shown*.3;modelGroup.rotation.y+=(pointerX*.07+shown*.065-modelGroup.rotation.y)*.04;modelGroup.rotation.x+=(-pointerY*.025-modelGroup.rotation.x)*.04;camera.position.z=7.5-shown*1.15;camera.position.y=2.1-shown*.12;camera.lookAt(0,.05,0);if(pointMaterial){pointMaterial.uniforms.uTime.value=time;pointMaterial.uniforms.uProgress.value=shown;pointMaterial.uniforms.uExit.value=clamp((progress-.94)/.06)*clamp(-section.getBoundingClientRect().bottom/innerHeight+1);points.visible=!reduce.matches}renderer.render(scene,camera)}
 function tick(now){frame=0;if(disposed||!visible||document.hidden)return;const dt=Math.min((now-last)/1000||.016,.04);last=now;time+=dt;if(loaded)render(dt);if(!reduce.matches)frame=requestAnimationFrame(tick)}
 function start(){if(!frame&&!disposed&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick)}}
 function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();removeEventListener('scroll',scroll);reduce.removeEventListener('change',scroll);document.removeEventListener('visibilitychange',changeVisibility);host.removeEventListener('pointermove',onPointer);host.removeEventListener('pointerleave',leave);scene.traverse(obj=>{obj.geometry?.dispose();if(obj.material){for(const m of Array.isArray(obj.material)?obj.material:[obj.material]){for(const value of Object.values(m))if(value?.isTexture){value.source?.data?.close?.();value.dispose()}m.dispose()}}});env.texture.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove()}
 const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
 // The rendered GLB preserves the exact supplied geometry. Its own materials are revealed in place.
 try{
  const gltf=await loader.loadAsync(new URL('../assets/models/crystal-rendered.glb',import.meta.url).href,event=>{if(event.total)status.textContent=`正在载入产品 ${Math.round(event.loaded/event.total*100)}%`});
  if(disposed||!host.isConnected){gltf.scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose?.()});dispose();return()=>{}}
  const model=gltf.scene;model.traverse(o=>{if(o.isLight)o.visible=false});const box=new THREE.Box3().setFromObject(model);const size=box.getSize(new THREE.Vector3());const center=box.getCenter(new THREE.Vector3());const scale=3/Math.max(size.x,size.y,size.z);model.scale.multiplyScalar(scale);model.position.sub(center.multiplyScalar(scale));const orientation=new THREE.Group();orientation.rotation.y=.55;orientation.add(model);modelGroup.add(orientation);modelGroup.updateMatrixWorld(true);
  model.traverse(o=>{if(o.isMesh){meshes.push(o);o.material=Array.isArray(o.material)?o.material.map(materialize):materialize(o.material)}});
  const count=innerWidth<760?3400:6200;const positions=new Float32Array(count*3),normals=new Float32Array(count*3),seeds=new Float32Array(count),colors=new Float32Array(count*3),uvs=new Float32Array(count*2);
  const p=new THREE.Vector3(),normal=new THREE.Vector3(),color=new THREE.Color(),uv=new THREE.Vector2();let k=0;
  const vertexTotal=meshes.reduce((n,m)=>n+m.geometry.getAttribute('position').count,0);
  for(let m=0;m<meshes.length;m++){const mesh=meshes[m];const sampler=new MeshSurfaceSampler(mesh).build();const target=m===meshes.length-1?count:Math.min(count,k+Math.round(count*mesh.geometry.getAttribute('position').count/vertexTotal));const mat=Array.isArray(mesh.material)?mesh.material[0]:mesh.material;const transform=new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
   while(k<target){sampler.sample(p,normal,color,uv);p.applyMatrix4(mesh.matrixWorld);normal.applyMatrix3(transform).normalize();p.toArray(positions,k*3);normal.toArray(normals,k*3);seeds[k]=Math.random();uv.toArray(uvs,k*2);const c=mat.color||new THREE.Color(.5,.6,1);c.toArray(colors,k*3);k++}
  }
  pointGeometry=new THREE.BufferGeometry();pointGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));pointGeometry.setAttribute('aNormal',new THREE.BufferAttribute(normals,3));pointGeometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));pointGeometry.setAttribute('aColor',new THREE.BufferAttribute(colors,3));pointGeometry.setAttribute('aUV',new THREE.BufferAttribute(uvs,2));
  pointMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.NormalBlending,uniforms:{uTime:{value:0},uProgress:{value:0},uExit:{value:0}},vertexShader:`
   uniform float uTime; uniform float uProgress; uniform float uExit; attribute vec3 aNormal; attribute float aSeed; attribute vec3 aColor; attribute vec2 aUV; varying vec3 vColor; varying float vAlpha;
   float expo(float x){return x<0.5?pow(2.0,20.0*x-10.0)/2.0:(2.0-pow(2.0,-20.0*x+10.0))/2.0;}
   void main(){float angle=aSeed*6.2831853+uTime*(0.075+aSeed*0.045);float ribbon=sin(aSeed*831.0)*0.45;float radius=2.05+ribbon*cos(angle*0.5);vec3 orbit=vec3(radius*cos(angle),ribbon*sin(angle*0.5)+sin(angle)*.35,radius*sin(angle)*.67);orbit.y+=sin(uTime*.4+aSeed*40.0)*.045;bool galaxy=fract(aSeed*91.17)<.25;float attach=expo(clamp((uProgress-.2)/.6,0.0,1.0));vec3 pos=galaxy?orbit:mix(orbit,position+aNormal*.012,attach);pos+=normalize(orbit)*uExit*3.0;
   vec3 awake=mix(vec3(.72,.78,1.0),vec3(.56,.49,1.0),aSeed);vec3 energy=mix(vec3(.66,.33,.97),vec3(.85,.27,.94),aSeed);vColor=mix(vec3(.70,.72,.76),awake,smoothstep(.15,.5,uProgress));vColor=mix(vColor,energy,smoothstep(.6,1.0,uProgress));vColor=mix(vColor,aColor,.18*attach*(galaxy?0.0:1.0));vAlpha=mix(.28,.72,smoothstep(.15,.5,uProgress));if(!galaxy)vAlpha*=1.0-smoothstep(.76,.94,uProgress);vAlpha*=1.0-uExit;
   vec4 mv=modelViewMatrix*vec4(pos,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((aSeed>.975?5.0:(aSeed>.75?2.5:1.1))*(7.0/-mv.z),.5,5.0);}
  `,fragmentShader:`varying vec3 vColor;varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float glow=1.0-smoothstep(.1,.5,d);gl_FragColor=vec4(vColor,vAlpha*glow);}`});
  points=new THREE.Points(pointGeometry,pointMaterial);points.frustumCulled=false;modelGroup.add(points);loaded=true;host.classList.add('ready');host.dataset.particles=String(count);host.dataset.model='loaded';scroll();render(.016);start();
 }catch(error){status.textContent='产品展示';section.dataset.fallback='true';host.dataset.model='fallback';renderer.domElement.hidden=true;console.warn('Model fallback:',error.message)}
 return dispose;
}
