import type { IScene } from "./IScene";
import type { UI } from "../UI";

import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { createShade } from "./components/shade";
import { createText } from "./components/text";
import { Countdown } from "./components/Countdown";
import { centerHorizontally } from "./utils/centering";

type TConstructor = {
   ui: UI;
}

export class GameOver implements IScene {
   public readonly ui: UI;
   private shadeElement?: HTMLDivElement;
   private textElement?: HTMLDivElement;
   private countdown?: Countdown;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      this.shadeElement = createShade();

      this.textElement = createText({
         text: "Game Over",
         fontSize: 27,
         top: 105,
      });
      centerHorizontally(this.textElement);

      this.countdown = new Countdown({
         secondsLeft: 5,
         onDone: this.handleCountdDownDone,
         fontSize: 26,
         top: 150,
      });
      centerHorizontally(this.countdown.element);
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
         this.ui.SetActiveScene(this.ui.enterHighscore, rank);
      } else {
         // TODO: reload just because app does not clear up by itself yet.
         BrowserDriver.WithWindow(window => {
            window.location.reload();
         });
         // this.ui.SetActiveScene(this.ui.startGame);
      }
   };
}
