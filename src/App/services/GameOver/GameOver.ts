import type { App } from "../../App";
import type { TEvent } from "../Events/Events";
import type { IService } from "../IService";

import { initGameOverElement } from "./gameOverElement";

type TConstructor = {
   app: App;
   name: string
}

export class GameOver implements IService {
   readonly app: App;
   readonly name: string;
   gameOverElement: HTMLDivElement;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.gameOverElement = initGameOverElement();
   }

   Init = () => {
      this.app.events.subscribeToEvent(this.name, this.onEvent);
   };

   /**
    * Private
    */

   private onEvent = (event: TEvent) => {
      switch(event.type) {
         case "frame_tick": {
            if(this.app.gameLoop.FrameCount >= 3200) {
               this.showGameOver();
            }
            break;
         }
         case "player_died": {
            this.showGameOver();
            break;
         }
      }
   };

   private showGameOver = () => {
      // TODO: Implement GameOver screenand behaviour.
      this.app.gameSpeed.GameSpeed = 0;
      this.gameOverElement.style.visibility = "visible";
      setTimeout(() => {
         // location.reload();
      }, 2000);
   };
}