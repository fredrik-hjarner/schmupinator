import type { IUI } from "./IUI";
import type { IScene } from "./Scenes/IScene";
import type { IEvents, TEvent } from "../Events/IEvents";
import type { GameLoop } from "../GameLoop/GameLoop";
import type { GameSpeed } from "../GameSpeed/GameSpeed";
import type { TInitParams } from "../IService";

import { StartGame } from "./Scenes/StartGame";
import { Game } from "./Scenes/Game";
import { GameOver } from "./Scenes/GameOver";
import { Highscore } from "./Scenes/Highscore";

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

   // Scenes
   startGame: IScene;
   game: IScene;
   gameOver: IScene;
   highscore: IScene;

   constructor({ name }: TConstructor) {
      this.name = name;

      this.startGame = new StartGame({ ui: this });
      this.game = new Game({ ui: this });
      this.gameOver = new GameOver({ ui: this });
      this.highscore = new Highscore({ ui: this });
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      this.events = deps?.events as IEvents;
      this.uiEvents = deps?.uiEvents as IEvents;
      this.gameLoop = deps?.gameLoop as GameLoop;
      this.gameSpeed = deps?.gameSpeed as GameSpeed;

      this.events.subscribeToEvent(this.name, this.onEvent);

      this.startGame.render();
      // this.gameOver.render();
   };

   private onEvent = (event: TEvent) => {
      switch(event.type) {
         case "frame_tick": {
            if(this.gameLoop.FrameCount >= 3200) {
               // TODO: THis is ugly. Should not assume which the active scene is.
               this.gameSpeed.GameSpeed = 0;
               this.game.destroy();
               this.gameOver.render();
            }
            break;
         }
         case "player_died": {
            // TODO: THis is ugly. Should not assume which the active scene is.
            this.gameSpeed.GameSpeed = 0;
            this.game.destroy();
            this.gameOver.render();
            break;
         }
      }
   };
}