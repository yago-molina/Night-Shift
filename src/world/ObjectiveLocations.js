// Positions refer to surfaces already built in Hospital.js (desk top y=.975, bed top y=.735).
// Only a selection of each pair appears during a campaign. The seed survives checkpoints.
export const OBJECTIVE_LOCATIONS=Object.freeze({
 key:[[-3.95,1.015,-9.12],[-2.14,1.015,-9.09]],
 occurrence:[[-3.43,1.004,-9.10],[-2.65,1.004,-9.08]],
 maintenance:[[-12.68,1.004,-9.10],[-11.57,1.004,-9.12]],
 reception:[[-11.3,1.004,-8.93],[-12.23,1.004,-8.88]],
 office:[ [11.18,1.004,-9.13],[11.38,1.004,-8.92] ],
 research:[[12.64,1.004,-9.12],[12.72,1.004,-8.9]],
 ward:[[-12.08,.785,6.7],[-9.12,.785,9.7]],
 surgery:[[12.18,.946,8.2],[11.05,.995,10.97]]
});
export function objectivePosition(id,campaignRandom){
 const choices=OBJECTIVE_LOCATIONS[id];
 if(!choices)throw new Error('Objetivo desconhecido: '+id);
 const index=campaignRandom?Math.floor(campaignRandom.roll('objective:'+id)*choices.length):0;
 return choices[index].slice();
}
