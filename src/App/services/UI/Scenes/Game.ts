import type { IScene } from "./IScene";
import type { TEvent } from "../../Events/IEvents";
import type { UI } from "../UI";

import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { zIndices } from "../../../../consts";
import { px } from "../../../../utils/px";

type TConstructor = {
   ui: UI;
}

export class Game implements IScene {
   //deps/services
   readonly ui: UI;

   // elements.
   private scoreElement?: HTMLDivElement;
   private hiscoreElement?: HTMLDivElement;

   constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   private createScore = () => {
      BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("div");
         this.scoreElement = element;

         element.style.color = "white";
         element.style.position = "fixed";
         element.style.top = px(10);
         element.style.left = px(20);
         element.style.fontSize = px(14);
         element.style.zIndex = zIndices.ui;
         
         element.innerHTML = "Score 0";

         window.document.body.appendChild(element);
         
         return element;
      });
   };

   private createHiscore = () => {
      BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("div");
         this.hiscoreElement = element;

         element.style.color = "white";
         element.style.position = "fixed";
         element.style.top = px(10);
         element.style.left = px(260);
         element.style.fontSize = px(14);
         element.style.zIndex = zIndices.ui;
         
         element.innerHTML = "Record 0";

         window.document.body.appendChild(element);
         
         return element;
      });
   };

   public render() {
      this.createScore();
      this.createHiscore();
      this.ui.uiEvents.subscribeToEvent("GameUI", this.onEvent);
   }

   public destroy() {
      this.scoreElement?.remove();
      this.scoreElement = undefined;

      this.hiscoreElement?.remove();
      this.hiscoreElement = undefined;

      this.ui.events.unsubscribeToEvent("GameUI");
   }

   private onEvent = (event: TEvent) => {
      switch(event.type) {
         case "uiScoreUpdated": {
            if(this.scoreElement) {
               this.scoreElement.innerHTML = `Score ${event.points}`;
            }
            break;
         }
      }
   };
}
