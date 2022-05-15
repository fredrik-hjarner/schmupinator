import { GameLoop } from './services/GameLoop/GameLoop.js';
import { Input } from './services/Input/Input.js';
import { Player } from './services/Player/Player.js';
import { Shots } from './services/Shots/Shots.js';

export class App {
  input: Input;
  gameLoop: GameLoop;
  player: Player;
  shots: Shots;

  constructor() {
    this.input = new Input(this);
    this.gameLoop = new GameLoop(this);
    this.player = new Player(this);
    this.shots = new Shots(this, { name: "playerShots", maxShots: 3*3 });
  }
}