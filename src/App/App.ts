import { Enemies } from './services/Enemies/Enemies';
import { GameLoop } from './services/GameLoop/GameLoop';
import { Input } from './services/Input/Input';
import { Player } from './services/Player/Player';
import { Shots } from './services/Shots/Shots';
import { GamePad } from './services/GamePad/GamePad';
import { Collisions } from './services/Collisions/Collisions';
import { Events } from './services/Events/Events';
import { GameSpeed } from './services/GameSpeed/GameSpeed';
import { Points } from './services/Points/Points';
import { GameOver } from './services/GameOver/GameOver';

export class App {
   input: Input;
   gameLoop: GameLoop;
   player: Player;
   playerShots: Shots;
   enemyShots: Shots;
   enemies: Enemies;
   gamepad: GamePad;
   collisions: Collisions;
   events: Events;
   gameSpeed: GameSpeed;
   points: Points;
   gameOver: GameOver;

   constructor() {
      /**
       * Constuct services
       */
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
      this.events = new Events({ app: this, name: "events" });
      this.gameSpeed = new GameSpeed({ app: this, name: "gameSpeed" });
      this.points = new Points({ app: this, name: "points" });
      this.gameOver = new GameOver({ app: this, name: "gameOver" });

      /**
       * Init services
       */
      this.player.Init();
      this.playerShots.Init();
      this.enemyShots.Init();
      this.enemies.Init();
      this.collisions.Init();
      this.points.Init();
      this.gameOver.Init();
   }
}