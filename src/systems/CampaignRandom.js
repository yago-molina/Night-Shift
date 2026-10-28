export class CampaignRandom {
 constructor(seed=Math.floor(Math.random()*2147483647)+1){this.seed=(Number(seed)>>>0)||1}
 roll(key){let x=this.seed;for(const char of String(key)){x=(Math.imul(x^char.charCodeAt(0),1664525)+1013904223)>>>0}return x/4294967296}
 drawerHasNote(id){return this.roll('drawer:'+id)<.5}
 raidMinute(){return 145+Math.floor(this.roll('security-raid')*155)}
}