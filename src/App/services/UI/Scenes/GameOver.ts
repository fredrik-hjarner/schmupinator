import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { createShade } from "./components/atoms/shade";
import { createText } from "./components/atoms/text";
import { Countdown } from "./components/molecules/Countdown";
import { centerHorizontally } from "./utils/centering";
import { fontSizes } from "./consts/fontSizes";

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
         fontSize: fontSizes.largest,
         top: 95,
      });
      centerHorizontally(this.textElement);

      this.countdown = new Countdown({
         input: this.ui.input,
         secondsLeft: 5,
         onDone: this.handleCountdDownDone,
         fontSize: fontSizes.largest,
         top: 130,
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
