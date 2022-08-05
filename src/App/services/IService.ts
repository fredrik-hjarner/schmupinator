import type { IEventsCollisions, IEventsPoints, IGameEvents, IUiEvents } from "./Events/IEvents";
import type { Settings } from "./Settings/Settings";
import type { IInput } from "./Input/IInput";
import type { IE2eTest } from "./E2eTest/IE2eTest";
import type { IGameLoop } from "./GameLoop/IGameLoop";
import type { IFps } from "./Fps/IFps";
import type { Enemies } from "./Enemies/Enemies";
import type { GamePad } from "./GamePad/GamePad";
import type { Collisions } from "./Collisions/Collisions";
import type { IGameSpeed } from "./GameSpeed/IGameSpeed";
import type { IPoints } from "./Points/IPoints";
import type { Highscore } from "./Highscore/Highscore";
import type { Yaml } from "./Yaml/Yaml";
import type { IGraphics } from "./Graphics/IGraphics";
import type { IUI } from "./UI/IUI";
import type { IFullscreen } from "./Fullscreen/IFullscreen";
import type { IParallax } from "./Parallax/IParallax";
import type { IOutsideHider } from "./OutsideHider/IOutsideHider";

export type TInitParams = Partial<{
  e2eTest: IE2eTest;
  settings: Settings;
  input: IInput;
  gameLoop: IGameLoop;
  fps: IFps;
  enemies: Enemies;
  gamepad: GamePad;
  collisions: Collisions;
  events: IGameEvents;
  eventsCollisions: IEventsCollisions;
  eventsUi: IUiEvents;
  eventsPoints: IEventsPoints;
  gameSpeed: IGameSpeed;
  points: IPoints;
  highscore: Highscore;
  yaml: Yaml;
  graphics: IGraphics;
  ui: IUI;
  fullscreen: IFullscreen;
  parallax: IParallax;
  outsideHider: IOutsideHider;
}>;

export interface IService {
  name: string;
  // Create: () => Promise<IService>
  /**
   * 2nd phase of initialization.
   * Here you are allowed to use other services (that are deps),
   * because you know they have initialized.
   */
  Init: (deps?: TInitParams) => Promise<void>
  // Destroy: () => void
}
