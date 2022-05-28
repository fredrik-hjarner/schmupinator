import { Enemies } from './services/Enemies/Enemies.js';
import { GameLoop } from './services/GameLoop/GameLoop.js';
import { Input } from './services/Input/Input.js';
import { Player } from './services/Player/Player.js';
import { Shots } from './services/Shots/Shots.js';
import { GamePad } from './services/GamePad/GamePad.js';
import { Collisions } from './services/Collisions/Collisions.js';

export class App {
  input: Input;
  gameLoop: GameLoop;
  player: Player;
  playerShots: Shots;
  enemyShots: Shots;
  enemies: Enemies;
  gamepad: GamePad;
  collisions: Collisions;

  constructor() {
    this.input = new Input();
    this.gameLoop = new GameLoop(this);
    this.player = new Player(this); // TODO: player should also have name
    this.playerShots = new Shots(
      this,
      // TODO: actually dont need name, could use uuid().
      { name: "playerShots", maxShots: 3*3, color: 'aqua', poolIndex: 0 }
    );
    this.enemyShots = new Shots(
      this,
      { name: "enemyShots", maxShots: 25, color: 'red', poolIndex: 1 }
    );
    this.enemies = new Enemies(this, { name: "enemies" });
    this.gamepad = new GamePad();
    this.collisions = new Collisions(this);
  }
}