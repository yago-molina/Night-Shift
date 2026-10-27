export class CollisionWorld{
 constructor(){this.boxes=[]}
 add(x,z,w,d){const box={minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2};this.boxes.push(box);return box}
 remove(box){const i=this.boxes.indexOf(box);if(i!==-1)this.boxes.splice(i,1)}
 blocked(x,z,r=.28){return this.boxes.some(b=>x+r>b.minX&&x-r<b.maxX&&z+r>b.minZ&&z-r<b.maxZ)}
 move(pos,dx,dz){if(!this.blocked(pos.x+dx,pos.z))pos.x+=dx;if(!this.blocked(pos.x,pos.z+dz))pos.z+=dz}
}