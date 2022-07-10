import type { IScene } from "./IScene";
import type { UI } from "../UI";

import { createShade } from "./utils/shade";
import { createText } from "./utils/text";
import { createButton } from "./utils/button";
import { createInput } from "./utils/input";
import { BrowserDriver } from "../../../../drivers/BrowserDriver";

type TConstructor = {
   ui: UI;
}

export class EnterHighscore implements IScene {
   readonly ui: UI;
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private subTitle?: HTMLDivElement;
   private button?: HTMLButtonElement;
   private input?: HTMLInputElement;

   constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      this.shadeElement = createShade();
      this.title = createText({
         text: "Made it into the Highscore", fontSize: 24, top: 10, left: 52
      });
      this.subTitle = createText({ text: "Enter your name", fontSize: 20, top: 60, left: 112 });
      this.button = createButton({
         text: "Done", fontSize: 20, top: 140, left: 149
      });
      this.input = createInput({
         placeholder: "Done", fontSize: 20, top: 99, left: 115
      });

      // TODO: Fix. Just some mocking atm.
      BrowserDriver.WithWindow(window => {
         window.setTimeout(() => {
            // Enter entry then go to Highscore screen.
            this.ui.highscoreService.registerNewEntry({
               name: "Nils",
               score: this.ui.points.points
            });
            this.ui.SetActiveScene(this.ui.highscore);
         }, 4000);
      });
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.title?.remove();
      this.title = undefined;

      this.subTitle?.remove();
      this.subTitle = undefined;

      this.button?.remove();
      this.button = undefined;

      this.input?.remove();
      this.input = undefined;
   }
}
