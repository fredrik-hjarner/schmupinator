import type { IScene } from "./IScene";
import type { UI } from "../UI";

import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { createShade } from "./utils/shade";
import { createText } from "./utils/text";
import { Countdown } from "./utils/Countdown";

type TConstructor = {
   ui: UI;
}

export class GameOver implements IScene {
   readonly ui: UI;
   private shadeElement?: HTMLDivElement;
   private textElement?: HTMLDivElement;
   private countdown?: Countdown;

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

      this.countdown = new Countdown({
         secondsLeft: 6,
         onDone: this.handleCountdDownDone,
         fontSize: 26,
         top: 150,
         left: 170,
      });
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.textElement?.remove();
      this.textElement = undefined;

      this.countdown?.destroy();
      this.countdown = undefined;
   }

   private handleCountdDownDone = () => {
      // TODO: Fix. Just some mocking atm.
      const points = this.ui.points.points;
      const { qualifiedForTop10: qualified, rank } =
         this.ui.highscoreService.qualifiedForTop10(points);

      if(qualified) {
         console.log(`qualified=${JSON.stringify(qualified)} rank=${JSON.stringify(rank)}`);
         this.ui.SetActiveScene(this.ui.enterHighscore, rank);
      } else {
         console.log(`qualified=${JSON.stringify(qualified)} rank=${JSON.stringify(rank)}`);
         // TODO: reload just because app does not clear up by itself yet.
         BrowserDriver.WithWindow(window => {
            window.location.reload();
         });
         // this.ui.SetActiveScene(this.ui.startGame);
      }
   };
}
