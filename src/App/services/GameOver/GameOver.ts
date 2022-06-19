import type { App } from "../../App";
import type { TEvent } from "../Events/Events";
import type { IService } from "../IService";

import { isHTMLDivElement } from "../../../utils/typeAssertions";
import { initGameOverElement } from "./gameOverElement";

type TConstructor = {
   app: App;
   name: string
}

export class GameOver implements IService {
   readonly app: App;
   readonly name: string;
   gameOverElement: unknown;

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
      if(isHTMLDivElement(this.gameOverElement)) {
         this.gameOverElement.style.visibility = "visible";
      }
   };
}