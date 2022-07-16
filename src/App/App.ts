/**
 * Interfaces
 */
import type { IInput } from "./services/Input/IInput";
import type { IGameLoop } from "./services/GameLoop/IGameLoop";
import type { IFps } from "./services/Fps/IFps";
import type { IGraphics } from "./services/Graphics/IGraphics";
import type { IPoints } from "./services/Points/IPoints";
import type { IUI } from "./services/UI/IUI";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { IGameEvents, IUiEvents, TGameEvent, TUiEvent } from "./services/Events/IEvents";
import type { IGameSpeed } from "./services/GameSpeed/IGameSpeed";
import type { IFullscreen } from "./services/Fullscreen/IFullscreen";
import type { IParallax } from "./services/Parallax/IParallax";
import type { IE2eTest } from "./services/E2eTest/IE2eTest";

/**
 * Services
 */
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
import { E2eTest } from "./services/E2eTest/E2eTest";
import { Settings } from "./services/Settings/Settings";

/**
 * "Mocks"/Service variations
 */
import { NoopService } from "./services/NoopService";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReplayerInput } from "./services/Input/mocks/ReplayerInput";
import { MockGraphics } from "./services/Graphics/MockGraphics";
import { NodeGameLoop } from "./services/GameLoop/variants/NodeGameLoop";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReqAnimFrameGameLoop } from "./services/GameLoop/variants/ReqAnimFrameGameLoop";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PointsTester } from "./services/Points/mocks/PointsTester";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RecordGameEvents } from "./services/Events/mocks/RecordGameEvents";
import { InvisibleGameSpeed } from "./services/GameSpeed/variants/InvisibleGameSpeed";
import { MockFps } from "./services/Fps/variants/MockFps";

/**
 * Other
 */
import { IsBrowser } from "../drivers/BrowserDriver";

export class App {
   // types here should not be IService but rather something that implements IService.
   // TODO: also all types should NOT be concrete types, but interfaces.
   public e2eTest: IE2eTest;
   public settings: Settings;
   public input: IInput;
   public gameLoop: IGameLoop;
   public fps: IFps;
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
      this.e2eTest = IsBrowser() ?
         new NoopService({ name: "e2e" }) :
         new E2eTest({ name: "e2e" });

      this.settings = new Settings({ name: "settings" });

      this.input = IsBrowser() ?
         // new Input({ name: "input" }) :
         new ReplayerInput({ name: "input" }) :
         new ReplayerInput({ name: "input" });

      this.gameLoop = IsBrowser() ?
         // new GameLoop({ app: this, name: "gameLoop" }) :
         new ReqAnimFrameGameLoop({ app: this, name: "gameLoop" }) :
         new NodeGameLoop({ app: this, name: "nodeGameLoop" });

      this.fps = IsBrowser() ?
         new Fps({ app: this, name: "fps" }) :
         // new MockFps({ app: this, name: "fps" }) :
         new MockFps({ app: this, name: "fps" });

      this.enemies = new Enemies({ name: "enemies" });

      this.gamepad = new GamePad({ name: "gamePad" });

      this.collisions = new Collisions({ name: "collisions" });

      this.events =  IsBrowser() ?
         // new Events<TGameEvent>({ app: this, name: "events" }) :
         // new RecordGameEvents({ app: this, name: "events" }) :
         new Events({ app: this, name: "events" }) :
         new Events({ app: this, name: "events" });

      this.uiEvents = new Events<TUiEvent>({ app: this, name: "uiEvents" });

      this.gameSpeed = IsBrowser() ?
         new GameSpeed({ name: "gameSpeed" }) :
         // new InvisibleGameSpeed({ name: "gameSpeed" }) :
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
         new NoopService({ name: "mockUi" });

      this.fullscreen = IsBrowser() ?
         // new Fullscreen({ name: "fullscreen" }) :
         new NoopService({ name: "fullscreen" }) :
         new NoopService({ name: "fullscreen" });

      this.parallax = IsBrowser() ?
         new Parallax({ name: "parallax" }) :
         new NoopService({ name: "parallax" });
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
         gameLoop, gamepad, gameSpeed, graphics,
         highscore,
         input,
         points,
         yaml,
         settings,
         uiEvents
      } = this;

      /**
       * Order of initialization usually don't matter.
       * Unfortunately Yaml has to init early since it needs to, right now, fetch
       * yaml async. Enemies needs to be available at least when Enemies service tries to use them.
       */
      await this.yaml.Init();

      await this.e2eTest.Init({
         events,
      });
      await this.settings.Init();
      await this.input.Init({
         events
      });
      await this.gameLoop.Init();
      await this.fps.Init();
      await this.enemies.Init({
         events,
         graphics,
         yaml,
         input,
         gamepad
      });
      await this.gamepad.Init();
      await this.collisions.Init({
         enemies,
         events,
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
         settings,
         uiEvents,
      });
      await this.highscore.Init();
      await this.fullscreen.Init();
      await this.parallax.Init({
         events,
      });
   };
}