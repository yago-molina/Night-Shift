import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
export class PostProcessing {
 constructor(renderer,scene,camera){
  this.composer=new EffectComposer(renderer);this.composer.addPass(new RenderPass(scene,camera));
  this.film=new ShaderPass({
   uniforms:{tDiffuse:{value:null},time:{value:0},grain:{value:.035},vignette:{value:.12},tension:{value:0},interference:{value:0}},
   vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
   fragmentShader:`uniform sampler2D tDiffuse;uniform float time,grain,vignette,tension,interference;varying vec2 vUv;
   float rand(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
   void main(){
    vec2 uv=vUv;float shift=sin(vUv.y*145.+time*28.)*interference*.002;uv.x+=shift;
    vec3 color=texture2D(tDiffuse,uv).rgb;
    float noise=(rand(vUv*vec2(1920.,1080.)+time*49.)-.5)*(grain+tension*.035+interference*.12);
    color+=noise;
    float d=length((vUv-.5)*vec2(1.1,1.));
    color*=1.-(vignette+tension*.10)*smoothstep(.18,.8,d);
    gl_FragColor=vec4(max(color,vec3(0.)),1.);
   }`
  });
  this.composer.addPass(this.film);this.composer.addPass(new OutputPass());
  this.time=0;this.interference=0;this.quality=true;
 }
 pulse(amount=.5){this.interference=Math.max(this.interference,amount)}
 setTension(value){this.film.uniforms.tension.value=Math.max(0,Math.min(1,value))}
 setEffectsEnabled(enabled){this.quality=enabled;this.film.uniforms.grain.value=enabled?.035:0;this.film.uniforms.vignette.value=enabled?.12:0}
 resize(w,h){this.composer.setSize(w,h)}
 render(dt){
  this.time+=dt;this.interference=Math.max(0,this.interference-dt*.72);
  this.film.uniforms.interference.value=this.quality?this.interference:0;
  this.film.uniforms.time.value=this.time;
  this.composer.render();
 }
}