/**
 * Interfaces
 */
import type { IInput } from "./services/Input/IInput";
import type { IGameLoop } from "./services/GameLoop/IGameLoop";
import type { IFps } from "./services/Fps/IFps";
import type { IGraphics } from "./services/Graphics/IGraphics";
import type { IPoints } from "./services/Points/IPoints";
import type { IUI } from "./services/UI/IUI";
import type { IGameEvents, IUiEvents, TGameEvent, TUiEvent } from "./services/Events/IEvents";
import type { IGameSpeed } from "./services/GameSpeed/IGameSpeed";
import type { IFullscreen } from "./services/Fullscreen/IFullscreen";
import type { IParallax } from "./services/Parallax/IParallax";

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
import { Fps } from "./services/Fps/Fps";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Input } from "./services/Input/Input";
import { Player } from "./services/Player/Player";
import { Shots } from "./services/Shots/Shots";
import { GamePad } from "./services/GamePad/GamePad";
import { Collisions } from "./services/Collisions/Collisions";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Events } from "./services/Events/Events";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GameSpeed } from "./services/GameSpeed/GameSpeed";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Points } from "./services/Points/Points";
import { Highscore } from "./services/Highscore/Highscore";
import { Yaml } from "./services/Yaml/Yaml";
import { Graphics } from "./services/Graphics/Graphics";
import { UI } from "./services/UI/UI";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Fullscreen } from "./services/Fullscreen/Fullscreen";
import { Parallax } from "./services/Parallax/Parallax";

/**
 * "Mocks"/Service variations
 */
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReplayerInput } from "./services/Input/mocks/ReplayerInput";
import { MockGraphics } from "./services/Graphics/MockGraphics";
import { NodeGameLoop } from "./services/GameLoop/mocks/NodeGameLoop";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PointsTester } from "./services/Points/mocks/PointsTester";
import { MockUI } from "./services/UI/MockUI";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RecordGameEvents } from "./services/Events/mocks/RecordGameEvents";
import { GameEventsTester } from "./services/Events/mocks/GameEventsTester";
import { InvisibleGameSpeed } from "./services/GameSpeed/variants/InvisibleGameSpeed";
import { MockFps } from "./services/Fps/variants/MockFps";
import { MockFullscreen } from "./services/Fullscreen/variants/MockFullscreen";

/**
 * Other
 */
import { IsBrowser } from "../drivers/BrowserDriver";
import { MockParallax } from "./services/Parallax/variants/MockParallax";

export class App {
   // types here should not be IService but rather something that implements IService.
   // TODO: also all types should NOT be concrete types, but interfaces.
   public input: IInput;
   public gameLoop: IGameLoop;
   public fps: IFps;
   public player: Player;
   public playerShots: Shots;
   public enemyShots: Shots;
   public enemies: Enemies;
   public gamepad: GamePad;
   public collisions: Collisions;
   public events: IGameEvents;
   /**
    * only listened to by the UI & UI Scenes,
    * other services send messages over uiEvents so that the UI know when to update.
    */
   public uiEvents: IUiEvents;
   public gameSpeed: IGameSpeed;
   public points: IPoints;
   public highscore: Highscore;
   public yaml: Yaml;
   public graphics: IGraphics;
   public ui: IUI;
   public fullscreen: IFullscreen;
   public parallax: IParallax;

   /**
    * Step 1 of initialization
    */
   public constructor() {
      /**
       * Constuct services
       */
      this.input = IsBrowser() ?
         // new Input({ app: this, name: "input" }) :
         new ReplayerInput({ app: this, name: "input" }) :
         new ReplayerInput({ app: this, name: "input" });

      this.gameLoop = IsBrowser() ?
         new GameLoop({ app: this, name: "gameLoop" }) :
         new NodeGameLoop({ app: this, name: "nodeGameLoop" });

      this.fps = IsBrowser() ?
         new Fps({ app: this, name: "fps" }) :
         // new MockFps({ app: this, name: "fps" }) :
         new MockFps({ app: this, name: "fps" });

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

      this.enemies = new Enemies({ name: "enemies" });

      this.gamepad = new GamePad({ name: "gamePad" });

      this.collisions = new Collisions({ name: "collisions" });

      this.events =  IsBrowser() ?
         new Events<TGameEvent>({ app: this, name: "events" }) :
         // new RecordEvents({ app: this, name: "events" }) :
         new GameEventsTester({ app: this, name: "events" });

      this.uiEvents = new Events<TUiEvent>({ app: this, name: "uiEvents" });

      this.gameSpeed = IsBrowser() ?
         // new GameSpeed({ name: "gameSpeed" }) :
         new InvisibleGameSpeed({ name: "gameSpeed" }) :
         new InvisibleGameSpeed({ name: "gameSpeed" });

      this.points = IsBrowser() ?
         new Points({ app: this, name: "points" }):
         // new PointsTester({ app: this, name: "xPointsTester" }):
         new PointsTester({ app: this, name: "xPointsTester" });
      // new Points({ app: this, name: "points" });

      this.highscore = new Highscore({ name: "highscore" });

      this.yaml = new Yaml({ name: "yaml" });

      this.graphics = IsBrowser() ?
         new Graphics({ name: "graphics" }) :
         new MockGraphics({ name: "mockGraphics" });

      this.ui = IsBrowser() ?
         new UI({ name: "ui" }) :
         new MockUI({ name: "mockUi" });

      this.fullscreen = IsBrowser() ?
         // new Fullscreen({ name: "fullscreen" }) :
         new MockFullscreen({ name: "fullscreen" }) :
         new MockFullscreen({ name: "fullscreen" });

      this.parallax = IsBrowser() ?
         new Parallax({ name: "parallax" }) :
         new MockParallax({ name: "parallax" });
   }

   /**
    * Step 2 of initialization.
    * 
    * The rules are essentially:
    * 1. In constructor you init what you can without using other services (as dependencies).
    * 2. If you need other services to init, then do that initialization in the Init function.
    */
   public Init = async () => {
      const {
         enemies, events,
         gameLoop, gameSpeed, graphics,
         highscore,
         player, playerShots, points,
         yaml,
         uiEvents
      } = this;

      /**
       * Order of initialization usually don't matter.
       * Unfortunately Yaml has to init early since it needs to, right now, fetch
       * yaml async. Enemies needs to be available at least when Enemies service tries to use them.
       */
      await this.yaml.Init();

      await this.input.Init();
      await this.gameLoop.Init();
      await this.fps.Init();
      await this.player.Init();
      await this.playerShots.Init();
      await this.enemyShots.Init();
      await this.enemies.Init({
         events,
         graphics,
         player,
         yaml,
      });
      await this.gamepad.Init();
      await this.collisions.Init({
         enemies,
         events,
         player,
         playerShots
      });
      await this.events.Init();
      await this.gameSpeed.Init();
      await this.points.Init();
      await this.graphics.Init();
      await this.ui.Init({
         events,
         gameLoop,
         gameSpeed,
         highscore,
         points,
         uiEvents,
      });
      await this.highscore.Init();
      await this.fullscreen.Init();
      await this.parallax.Init({
         events,
      });
   };
}