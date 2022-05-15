import { GameLoop } from './gameLoop/gameLoop.js';
import { Input } from './input/input.js';
import { Player } from './player/player.js';
import { Shots } from './Shots/Shots.js';

export class App {
  input: Input;
  gameLoop: GameLoop;
  player: Player;
  shots: Shots;

  constructor() {
    this.input = new Input(this);
    this.gameLoop = new GameLoop(this);
    this.player = new Player(this);
    this.shots = new Shots(this);
  }
}