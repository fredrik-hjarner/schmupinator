import type { IUI } from "./IUI";
import type { IScene } from "./Scenes/IScene";
import type { IEvents, TEvent } from "../Events/IEvents";
import type { GameLoop } from "../GameLoop/GameLoop";
import type { GameSpeed } from "../GameSpeed/GameSpeed";
import type { TInitParams } from "../IService";
import type { Highscore as THighscoreService } from "../Highscore/Highscore";
import type { IPoints } from "../Points/IPoints";

import { StartGame } from "./Scenes/StartGame";
import { Game } from "./Scenes/Game";
import { GameOver } from "./Scenes/GameOver";
import { Highscore } from "./Scenes/Highscore";
import { EnterHighscore } from "./Scenes/EnterHighscore";

type TConstructor = {
   name: string
}

export class UI implements IUI {
   readonly name: string;

   // deps/services
   events!: IEvents;
   uiEvents!: IEvents;
   gameLoop!: GameLoop;
   gameSpeed!: GameSpeed;
   highscoreService!: THighscoreService;
   points!: IPoints;

   // Scenes
   startGame: IScene;
   game: IScene;
   gameOver: IScene;
   highscore: IScene;
   enterHighscore: IScene;

   // Active scene
   activeScene?: IScene;

   constructor({ name }: TConstructor) {
      this.name = name;

      this.startGame = new StartGame({ ui: this });
      this.game = new Game({ ui: this });
      this.gameOver = new GameOver({ ui: this });
      this.highscore = new Highscore({ ui: this });
      this.enterHighscore = new EnterHighscore({ ui: this });
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      this.events = deps?.events as IEvents;
      this.uiEvents = deps?.uiEvents as IEvents;
      this.gameLoop = deps?.gameLoop as GameLoop;
      this.gameSpeed = deps?.gameSpeed as GameSpeed;
      this.highscoreService = deps?.highscore as THighscoreService;
      this.points = deps?.points as IPoints;

      this.events.subscribeToEvent(this.name, this.onEvent);

      this.SetActiveScene(this.startGame);
      // this.enterHighscore.render();
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

   private onEvent = (event: TEvent) => {
      switch(event.type) {
         case "frame_tick": {
            if(this.gameLoop.FrameCount >= 3200) {
               // TODO: THis is ugly. Should not assume which the active scene is.
               this.gameSpeed.GameSpeed = 0;
               this.SetActiveScene(this.gameOver);
            }
            break;
         }
         case "player_died": {
            // TODO: THis is ugly. Should not assume which the active scene is.
            this.gameSpeed.GameSpeed = 0;
            this.SetActiveScene(this.gameOver);
            break;
         }
      }
   };
}