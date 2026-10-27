import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
export class PostProcessing{
 constructor(renderer,scene,camera){
 this.composer=new EffectComposer(renderer);this.composer.addPass(new RenderPass(scene,camera));
 this.film=new ShaderPass({uniforms:{tDiffuse:{value:null},time:{value:0},grain:{value:.035},vignette:{value:.12}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`uniform sampler2D tDiffuse;uniform float time;uniform float grain;uniform float vignette;varying vec2 vUv;float rand(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}void main(){vec3 color=texture2D(tDiffuse,vUv).rgb;float noise=(rand(vUv*vec2(1920.,1080.)+time*49.)-.5)*grain;color+=noise;float d=length((vUv-.5)*vec2(1.1,1.));color*=1.-vignette*smoothstep(.18,.8,d);gl_FragColor=vec4(color,1.);}`});
 this.composer.addPass(this.film);this.composer.addPass(new OutputPass());this.time=0;
 }
 resize(w,h){this.composer.setSize(w,h)}
 render(dt){this.time+=dt;this.film.uniforms.time.value=this.time;this.composer.render()}
}