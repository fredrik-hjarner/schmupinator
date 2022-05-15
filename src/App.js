import { GameLoop } from './gameLoop/gameLoop.js';
import { Input } from './input/input.js';
import { Player } from './player/player.js';

export class App {
  input: Input;
  gameLoop: GameLoop;
  player: Player;

  constructor() {
    this.input = new Input(this);
    this.gameLoop = new GameLoop(this);
    this.player = new Player(this);
  }
}