export class InventorySystem{
 constructor(){this.items=[];this.capacity=8}
 add(item){if(this.items.length>=this.capacity)return false;this.items.push({...item});return true}
 has(id){return this.items.some(item=>item.id===id)}
 count(type){return this.items.filter(item=>item.type===type).length}
 consume(type){const index=this.items.findIndex(item=>item.type===type);if(index<0)return false;this.items.splice(index,1);return true}
 getAll(){return this.items.slice()}
}