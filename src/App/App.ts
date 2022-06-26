/**
 * Interfaces
 */
import type { IInput } from "./services/Input/IInput";
import type { IGameLoop } from "./services/GameLoop/IGameLoop";
import type { IGraphics } from "./services/Graphics/IGraphics";
import type { IPoints } from "./services/Points/IPoints";

/**
 * Services
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Enemies } from "./services/Enemies/Enemies";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GameLoop } from "./services/GameLoop/GameLoop";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Input } from "./services/Input/Input";
import { Player } from "./services/Player/Player";
import { Shots } from "./services/Shots/Shots";
import { GamePad } from "./services/GamePad/GamePad";
import { Collisions } from "./services/Collisions/Collisions";
import { Events } from "./services/Events/Events";
import { GameSpeed } from "./services/GameSpeed/GameSpeed";
import { Points } from "./services/Points/Points";
import { GameOver } from "./services/GameOver/GameOver";
import { Yaml } from "./services/Yaml/Yaml";
import { Graphics } from "./services/Graphics/Graphics";

/**
 * "Mocks"
 */
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReplayerInput } from "./services/Input/mocks/ReplayerInput";
import { MockGraphics } from "./services/Graphics/MockGraphics";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FastGameLoop } from "./services/GameLoop/mocks/FastGameLoop";
import { NodeGameLoop } from "./services/GameLoop/mocks/NodeGameLoop";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PointsTester } from "./services/Points/mocks/PointsTester";

/**
 * Other
 */
import { IsBrowser } from "../drivers/BrowserDriver";

export class App {
   // types here should not be IService but rather something that implements IService.
   // TODO: also all types should NOT be concrete types, but interfaces.
   input: IInput;
   gameLoop: IGameLoop;
   player: Player;
   playerShots: Shots;
   enemyShots: Shots;
   enemies: Enemies;
   gamepad: GamePad;
   collisions: Collisions;
   events: Events;
   gameSpeed: GameSpeed;
   points: IPoints;
   gameOver: GameOver;
   yaml: Yaml;
   graphics: IGraphics;

   /**
    * Step 1 of initialization
    */
   constructor() {
      /**
       * Constuct services
       */
      this.input = IsBrowser() ?
         // new Input({ app: this, name: "input" }) :
         new ReplayerInput({ app: this, name: "input" }) :
         new ReplayerInput({ app: this, name: "input" });
      this.gameLoop = IsBrowser() ?
         new GameLoop({ app: this, name: "gameLoop" }) :
         // new FastGameLoop({ app: this, name: "gameLoop" }) :
         new NodeGameLoop({ app: this, name: "nodeGameLoop" });
      this.player = new Player({ app: this, name: "player" });
      this.playerShots = new Shots(
         this,
         // TODO: actually dont need name, could use uuid().
         { name: "playerShots", maxShots: 3*3, color: "aqua" }
      );
      this.enemyShots = new Shots(
         this,
         { name: "enemyShots", maxShots: 25, color: "red" }
      );
      this.enemies = new Enemies(this, { name: "enemies" });
      this.gamepad = new GamePad({ app: this, name: "gamePad" });
      this.collisions = new Collisions({ app: this, name: "collisions" });
      this.events = new Events({ app: this, name: "events" });
      this.gameSpeed = new GameSpeed({ app: this, name: "gameSpeed" });
      this.points = IsBrowser() ?
         new Points({ app: this, name: "points" }):
         new PointsTester({ app: this, name: "xPointsTester" });
      // new Points({ app: this, name: "points" });
      this.gameOver = new GameOver({ app: this, name: "gameOver" });
      this.yaml = new Yaml({ app: this, name: "yaml" });
      this.graphics = IsBrowser() ?
         new Graphics({ app: this, name: "graphics" }) :
         new MockGraphics({ app: this, name: "mockGraphics" });
   }

   /**
    * Step 2 of initialization.
    * 
    * The rules are essentially:
    * 1. In constructor you init what you can without using other services (as dependencies).
    * 2. If you need other services to init, then do that initialization in the Init function.
    */
   Init = async () => {
      /**
       * Order of initialization usually don't matter.
       * Unfortunately Yaml has to init early since it needs to, right now, fetch
       * yaml async. Enemies needs to be available at least when Enemies service tries to use them.
       */
      await this.yaml.Init();

      await this.input.Init();
      await this.gameLoop.Init();
      await this.player.Init();
      await this.playerShots.Init();
      await this.enemyShots.Init();
      await this.enemies.Init();
      await this.gamepad.Init();
      await this.collisions.Init();
      await this.events.Init();
      await this.gameSpeed.Init();
      await this.points.Init();
      await this.gameOver.Init();
      await this.graphics.Init();
   };
}