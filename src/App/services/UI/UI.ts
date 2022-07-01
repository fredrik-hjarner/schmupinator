import type { App } from "../../App";
import type { IUI } from "./IUI";
import type { IScene } from "./Scenes/IScene";
import type { TEvent } from "../Events/Events";

import { StartGame } from "./Scenes/StartGame";
import { Game } from "./Scenes/Game";
import { GameOver } from "./Scenes/GameOver";

type TConstructor = {
   app: App;
   name: string
}

export class UI implements IUI {
   readonly app: App;
   readonly name: string;

   startGame: IScene;
   game: IScene;
   gameOver: IScene;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.startGame = new StartGame({ app, ui: this });
      this.game = new Game({ app, ui: this });
      this.gameOver = new GameOver({ app, ui: this });
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async () => {
      this.app.events.subscribeToEvent(this.name, this.onEvent);

      this.startGame.render();
      // this.gameOver.render();
   };

   private onEvent = (event: TEvent) => {
      switch(event.type) {
         case "frame_tick": {
            if(this.app.gameLoop.FrameCount >= 3200) {
               // TODO: THis is ugly. Should not assume which the active scene is.
               this.app.gameSpeed.GameSpeed = 0;
               this.game.destroy();
               this.gameOver.render();
            }
            break;
         }
         case "player_died": {
            // TODO: THis is ugly. Should not assume which the active scene is.
            this.app.gameSpeed.GameSpeed = 0;
            this.game.destroy();
            this.gameOver.render();
            break;
         }
      }
   };
}