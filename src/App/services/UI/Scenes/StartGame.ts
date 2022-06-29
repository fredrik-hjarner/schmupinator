import type { IScene } from "./IScene";
import type { App } from "../../../App";
import type { IUI } from "../IUI";

import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { resolutionHeight, resolutionWidth, zIndices } from "../../../../consts";
import { px } from "../../../../utils/px";

type TConstructor = {
   app: App;
   ui: IUI;
}

export class StartGame implements IScene {
   readonly app: App;
   readonly ui: IUI;
   private startButtonElement?: HTMLButtonElement;
   private shadeElement?: HTMLDivElement;

   constructor(params: TConstructor) {
      this.app = params.app;
      this.ui = params.ui;
   }

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
      BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("div");
         this.shadeElement = element;

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

   private startGame = () => {
      this.app.gameLoop.Start();
      this.destroy();
   };

   private createButton = () => {
      BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("button");
         this.startButtonElement = element;

         const text = window.document.createTextNode("Start game");
         element.appendChild(text);

         element.style.position = "fixed";
         element.style.top = px(114);
         element.style.left = px(119);
         element.style.zIndex = zIndices.ui;
         element.style.fontSize = px(22);
         element.style.padding = "5px 10px";
         element.onclick = this.startGame;

         window.document.body.appendChild(element);
         
         return element;
      });
   };
}
