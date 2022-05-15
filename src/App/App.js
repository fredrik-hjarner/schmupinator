import { Enemies } from './services/Enemies/Enemies.js';
import { GameLoop } from './services/GameLoop/GameLoop.js';
import { Input } from './services/Input/Input.js';
import { Player } from './services/Player/Player.js';
import { Shots } from './services/Shots/Shots.js';

export class App {
  input: Input;
  gameLoop: GameLoop;
  player: Player;
  playerShots: Shots;
  enemyShots: Shots;
  enemies: Enemies;

  constructor() {
    this.input = new Input(this);
    this.gameLoop = new GameLoop(this);
    this.player = new Player(this); // TODO: player should also have name
    this.playerShots = new Shots(
      this,
      { name: "playerShots", maxShots: 3*3, color: 'aqua', poolIndex: 0 }
    );
    this.enemyShots = new Shots(
      this,
      { name: "enemyShots", maxShots: 25, color: 'red', poolIndex: 1 }
    );
    this.enemies = new Enemies(this, { name: "enemies" });
  }
}