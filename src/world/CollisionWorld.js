export class CollisionWorld {
 constructor(){this.boxes=[]}
 add(x,z,w,d,options={}){const b={minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2,door:!!options.door};this.boxes.push(b);return b}
 remove(b){const i=this.boxes.indexOf(b);if(i>=0)this.boxes.splice(i,1)}
 blocked(x,z,r=.28,ignoreDoors=false){return this.boxes.some(b=>(!ignoreDoors||!b.door)&&x+r>b.minX&&x-r<b.maxX&&z+r>b.minZ&&z-r<b.maxZ)}
 move(pos,dx,dz){if(!this.blocked(pos.x+dx,pos.z))pos.x+=dx;if(!this.blocked(pos.x,pos.z+dz))pos.z+=dz}
}