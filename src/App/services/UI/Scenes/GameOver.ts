import type { IScene } from "./IScene";
import type { UI } from "../UI";

import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { resolutionHeight, resolutionWidth, zIndices } from "../../../../consts";
import { px } from "../../../../utils/px";

type TConstructor = {
   ui: UI;
}

export class GameOver implements IScene {
   readonly ui: UI;
   private shadeElement?: HTMLDivElement;

   constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      this.createShade();

      // TODO: Fix. Just some mocking atm.
      BrowserDriver.WithWindow(window => {
         window.setTimeout(() => {
            this.destroy();
            this.ui.enterHighscore.render();
         }, 5000);
      });
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;
   }

   // TODO: reduce this being created for all scenes.
   private createShade = () => {
      BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("div");
         this.shadeElement = element;

         const text = window.document.createTextNode("Game over");
         element.appendChild(text);

         element.style.lineHeight = px(resolutionHeight);
         element.style.color = "white";
         element.style.textAlign = "center";
         element.style.fontSize = px(27);

         // element.id = handle;
         element.style.position = "fixed";
         element.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
         element.style.top = px(0);
         element.style.left = px(0);
         element.style.width = px(resolutionWidth);
         element.style.height = px(resolutionHeight);
         element.style.zIndex = zIndices.ui;

         window.document.body.appendChild(element);
         
         return element;
      });
   };
}
