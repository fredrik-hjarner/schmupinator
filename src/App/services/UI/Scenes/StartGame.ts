import type { IScene } from "./IScene";

import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { resolutionHeight, resolutionWidth, zIndices } from "../../../../consts";
import { px } from "../../../../utils/px";

export class StartGame implements IScene {
   private startButtonElement?: HTMLButtonElement;
   private shadeElement?: HTMLDivElement;

   public render() {
      this.createShade();
      this.createButton();
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.startButtonElement?.remove();
      this.startButtonElement = undefined;
   }

   private createShade = () => {
      this.startButtonElement = BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("div");

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
      }) as HTMLButtonElement;
   };

   private createButton = () => {
      this.startButtonElement = BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("button");

         const text = window.document.createTextNode("Start game");
         element.appendChild(text);

         element.style.position = "fixed";
         element.style.top = px(114);
         element.style.left = px(119);
         element.style.zIndex = zIndices.ui;
         element.style.fontSize = px(22);
         element.style.padding = "5px 10px";

         window.document.body.appendChild(element);
         
         return element;
      }) as HTMLButtonElement;
   };
}
