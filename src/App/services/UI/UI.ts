import type { IUI } from "./IUI";
import type { IScene } from "./Scenes/types/IScene";
import type { IGameEvents, IUiEvents, TGameEvent } from "../Events/IEvents";
import type { IGameLoop } from "../GameLoop/IGameLoop";
import type { TInitParams } from "../IService";
import type { Highscore as THighscoreService } from "../Highscore/Highscore";
import type { IPoints } from "../Points/IPoints";
import type { Settings as TSettingsService } from "../Settings/Settings";
import type { IInput } from "../Input/IInput";

import { StartGame } from "./Scenes/StartGame";
import { Game } from "./Scenes/Game";
import { GameOver } from "./Scenes/GameOver";
import { Highscore } from "./Scenes/Highscore";
import { EnterHighscore } from "./Scenes/EnterHighscore";
import { Settings } from "./Scenes/Settings";
import { SettingsControls } from "./Scenes/SettingsControls";
import { DisplayControls } from "./Scenes/DisplayControls";
import { SelectGame } from "./Scenes/SelectGame";
import { SelectGameForHighscore } from "./Scenes/SelectGameForHighscore";
import { GameData } from "../GamaData/GameData";

type TConstructor = {
   name: string
}

export class UI implements IUI {
   public readonly name: string;

   // deps/services
   public events!: IGameEvents;
   public eventsUi!: IUiEvents;
   public gameLoop!: IGameLoop;
   public highscoreService!: THighscoreService;
   public points!: IPoints;
   public settingsService!: TSettingsService;
   public input!: IInput;
   public gameData!: GameData;

   // Scenes
   public startGame: IScene;
   public selectGame: IScene;
   public settings: IScene;
   public game: IScene;
   public gameOver: IScene;
   public highscore: IScene;
   public selectGameForHighscore: IScene;
   public enterHighscore: IScene;
   public settingsControls: IScene;
   public displayControls: IScene;

   // Active scene
   private activeScene?: IScene;

   public constructor({ name }: TConstructor) {
      this.name = name;

      this.startGame = new StartGame({ ui: this });
      this.selectGame = new SelectGame({ ui: this });
      this.settings = new Settings({ ui: this });
      this.game = new Game({ ui: this });
      this.gameOver = new GameOver({ ui: this });
      this.highscore = new Highscore({ ui: this });
      this.selectGameForHighscore = new SelectGameForHighscore({ ui: this });
      this.enterHighscore = new EnterHighscore({ ui: this });
      this.settingsControls = new SettingsControls({ ui: this });
      this.displayControls = new DisplayControls({ ui: this });
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      this.events = deps?.events as IGameEvents;
      this.eventsUi = deps?.eventsUi as IUiEvents;
      this.gameLoop = deps?.gameLoop as IGameLoop;
      this.highscoreService = deps?.highscore as THighscoreService;
      this.points = deps?.points as IPoints;
      this.settingsService = deps?.settings as TSettingsService;
      this.input = deps?.input as IInput;
      this.gameData = deps?.gameData as GameData;

      this.events.subscribeToEvent(this.name, this.onEvent);

      this.SetActiveScene(this.startGame);
      // this.SetActiveScene(this.enterHighscore);
      // this.SetActiveScene(this.highscore, 2);
      // this.SetActiveScene(this.gameOver);
   };

   public SetActiveScene = (scene: IScene, props?: unknown) => {
      if(scene === this.activeScene) {
         // same scene already active.
         console.warn("Trying to set a scene to active which is already active.");
         return;
      }

      if(this.activeScene) {
         this.activeScene.destroy();
      }

      this.activeScene = scene;
      this.activeScene.render(props);
   };

   private onEvent = (event: TGameEvent) => {
      switch(event.type) {
         case "frame_tick": {
            if(this.gameLoop.FrameCount >= 3200) {
               this.gameLoop.pause();
               this.SetActiveScene(this.gameOver);
            }
            break;
         }
         case "player_died": {
            this.gameLoop.pause();
            this.SetActiveScene(this.gameOver);
            break;
         }
      }
   };

   public destroy = () => {
      // Destroy all scenes // TODO: should prolly be a loop or somethin'
      this.startGame.destroy();
      this.settings.destroy();
      this.game.destroy();
      this.gameOver.destroy();
      this.highscore.destroy();
      this.enterHighscore.destroy();
      this.settingsControls.destroy();
      this.displayControls.destroy();

      // Unsubscribe to events.
      this.events.unsubscribeToEvent(this.name);

      // Unset active scene
      this.activeScene = undefined;
   };
}