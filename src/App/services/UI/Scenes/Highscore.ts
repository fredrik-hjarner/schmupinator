import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createShade } from "./components/shade";
import { createText } from "./components/text";
import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { Countdown } from "./components/Countdown";
import { isNumber } from "../../../../utils/typeAssertions";
import { centerHorizontally } from "./utils/centering";
import { fontSizes } from "./consts/fontSizes";

type TConstructor = {
   ui: UI;
}

export class Highscore implements IScene {
   // deps/services
   public readonly ui: UI;

   // vars
   private rank?: number;

   // elements
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private top10?: HTMLDivElement;
   private countdown?: Countdown;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   private getTop10Text = (): string => {
      const header = `Rank\t\tScore\t\tPlayer`;
      const top10 = this.ui.highscoreService.getTop10()
         .map(({ name, score }, i) => {
            if(isNumber(this.rank) && this.rank === i) {
               return `<span class="flash1s">${i+1}\t\t${score}\t\t${name}</span>`;
            }
            return `${i+1}\t\t${score}\t\t${name}`;
         });
      return [header, ...top10].join("\n");
   };

   // if rank is a number it intructs to highlight that rank in the top10 list.
   public render(rank: unknown) {
      if(isNumber(rank)) {
         this.rank = rank;
      }
      this.shadeElement = createShade();

      this.title = createText({
         text: "Highscore", fontSize: fontSizes.large, top: 5
      });
      centerHorizontally(this.title);

      this.top10 = createText({
         text: this.getTop10Text(), fontSize: fontSizes.small, top: 38
      });
      centerHorizontally(this.top10);

      this.countdown = new Countdown({
         secondsLeft: 15,
         onDone: this.handleCountdDownDone,
         fontSize: fontSizes.large,
         top: 5,
         left: 315,
      });
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.title?.remove();
      this.title = undefined;

      this.top10?.remove();
      this.top10 = undefined;

      this.countdown?.destroy();
      this.countdown = undefined;
   }

   private handleCountdDownDone = () => {
      BrowserDriver.WithWindow(window => {
         // TODO: reload just because app does not clear up by itself yet.
         window.location.reload();
         // this.ui.SetActiveScene(this.ui.startGame);
      });
   };
}
