import './style.css';
import {Game} from './core/Game.js';
import {showGameError} from './core/RuntimeRecovery.js';

try{
 const app=document.getElementById('app');
 if(!app)throw new Error('Elemento principal #app não encontrado.');
 new Game(app);
}catch(error){
 showGameError(error);
}
