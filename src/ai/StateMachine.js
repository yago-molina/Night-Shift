export const AIState=Object.freeze({PATROL:'PATROL',INVESTIGATE:'INVESTIGATE',CHASE:'CHASE',SEARCH:'SEARCH',RETURN:'RETURN',ATTACK:'ATTACK'});
export class StateMachine{
 constructor(initial=AIState.PATROL,onChange=()=>{}){this.state=initial;this.time=0;this.onChange=onChange}
 set(next){if(next===this.state)return;const previous=this.state;this.state=next;this.time=0;this.onChange(next,previous)}
 update(dt){this.time+=dt}
}