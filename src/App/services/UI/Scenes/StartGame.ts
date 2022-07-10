import type { IScene } from "./IScene";
import type { UI } from "../UI";

import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { zIndices } from "../../../../consts";
import { px } from "../../../../utils/px";
import { createShade } from "./utils/shade";

type TConstructor = {
   ui: UI;
}

export class StartGame implements IScene {
   readonly ui: UI;
   private startButtonElement?: HTMLButtonElement;
   private shadeElement?: HTMLDivElement;

   constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      this.shadeElement = createShade();
      this.createButton();
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.startButtonElement?.remove();
      this.startButtonElement = undefined;
   }

   private startGame = () => {
      this.ui.gameLoop.Start();

      // TODO: This is super ugly. UI should have logic for switching scenes!
      this.ui.SetActiveScene(this.ui.game);
   };

   private createButton = () => {
      BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("button");
         this.startButtonElement = element;

         const text = window.document.createTextNode("Start game");
         element.appendChild(text);

         element.style.position = "fixed";
         element.style.top = px(110);
         element.style.left = px(115);
         element.style.zIndex = zIndices.ui;
         element.style.fontSize = px(22);
         element.style.padding = "5px 10px";
         element.onclick = this.startGame;

         window.document.body.appendChild(element);
         
         return element;
      });
   };
}
