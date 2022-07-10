import type { IScene } from "./IScene";
import type { UI } from "../UI";

import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { createShade } from "./utils/shade";
import { createText } from "./utils/text";

type TConstructor = {
   ui: UI;
}

export class GameOver implements IScene {
   readonly ui: UI;
   private shadeElement?: HTMLDivElement;
   private textElement?: HTMLDivElement;

   constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      this.shadeElement = createShade();
      this.shadeElement = createText({
         text: "Game Over",
         fontSize: 27,
         top: 105,
         left: 115,
      });

      // TODO: Fix. Just some mocking atm.
      BrowserDriver.WithWindow(window => {
         window.setTimeout(() => {
            const points = this.ui.points.points;
            const { qualifiedForTop10: qualified, rank } =
               this.ui.highscoreService.qualifiedForTop10(points);

            if(qualified) {
               console.log(`qualified=${JSON.stringify(qualified)} rank=${JSON.stringify(rank)}`);
               this.ui.SetActiveScene(this.ui.enterHighscore);
            } else {
               console.log(`qualified=${JSON.stringify(qualified)} rank=${JSON.stringify(rank)}`);
               // TODO: reload just because app does not clear up by itself yet.
               window.location.reload();
               // this.ui.SetActiveScene(this.ui.startGame);
            }
         }, 4000);
      });
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.textElement?.remove();
      this.textElement = undefined;
   }
}
