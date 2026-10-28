// A* grid navigation. Door colliders are ignored only for planning; the creature opens them physically when nearby.
export class Navigation{
 constructor(collision,{cell=.65,minX=-15.6,maxX=15.6,minZ=-12.6,maxZ=12.6}={}){
  this.collision=collision;this.blockedArea=()=>false;this.cell=cell;this.minX=minX;this.minZ=minZ;
  this.cols=Math.floor((maxX-minX)/cell)+1;this.rows=Math.floor((maxZ-minZ)/cell)+1;
 }
 index(x,z){return z*this.cols+x}
 cellFor(p){return {x:Math.max(0,Math.min(this.cols-1,Math.round((p.x-this.minX)/this.cell))),z:Math.max(0,Math.min(this.rows-1,Math.round((p.z-this.minZ)/this.cell)))}}
 point(x,z){return {x:this.minX+x*this.cell,z:this.minZ+z*this.cell}}
 free(x,z){if(x<0||z<0||x>=this.cols||z>=this.rows)return false;const p=this.point(x,z);return !this.blockedArea(p)&&!this.collision.blocked(p.x,p.z,.29,true)}
 findFree(cell){if(this.free(cell.x,cell.z))return cell;for(let r=1;r<=5;r++)for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dz))!==r)continue;const x=cell.x+dx,z=cell.z+dz;if(this.free(x,z))return {x,z}}return null}
 path(from,to){
  const start=this.findFree(this.cellFor(from)),end=this.findFree(this.cellFor(to));
  if(!start||!end)return [];
  const n=this.cols*this.rows,score=new Float64Array(n).fill(Infinity),came=new Int32Array(n).fill(-1),closed=new Uint8Array(n);
  const startId=this.index(start.x,start.z),endId=this.index(end.x,end.z);
  score[startId]=0;
  const queue=[{id:startId,f:Math.hypot(start.x-end.x,start.z-end.z)}];
  const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  let iterations=0;
  while(queue.length&&iterations++<n*2){
   let best=0;for(let i=1;i<queue.length;i++)if(queue[i].f<queue[best].f)best=i;
   const id=queue.splice(best,1)[0].id;if(closed[id])continue;closed[id]=1;
   if(id===endId){const path=[];let curr=id;while(curr!==startId&&curr!==-1){path.push(this.point(curr%this.cols,Math.floor(curr/this.cols)));curr=came[curr]}return path.reverse()}
   const cx=id%this.cols,cz=Math.floor(id/this.cols);
   for(const [dx,dz] of dirs){const x=cx+dx,z=cz+dz;if(!this.free(x,z))continue;
    const next=this.index(x,z);if(closed[next])continue;const newScore=score[id]+1;
    if(newScore>=score[next])continue;came[next]=id;score[next]=newScore;
    queue.push({id:next,f:newScore+Math.abs(end.x-x)+Math.abs(end.z-z)});
   }
  }
  return [];
 }
}