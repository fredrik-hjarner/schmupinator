import type { IScene } from "./IScene";
import type { UI } from "../UI";

import { createShade } from "./components/shade";
import { createText } from "./components/text";
import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { Countdown } from "./components/Countdown";
import { isNumber } from "../../../../utils/typeAssertions";
import { centerHorizontally } from "./utils/centering";

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
      const header = `Rank\t\t\tScore\t\t\tPlayer`;
      const animation = `<style>
            @keyframes flash {
               0%   { color: rgb(255,10,10); }
               33%  { color: rgb(0,255,0); }
               66%  { color: rgb(80,80,255); }
               100% { color: rgb(255,0,0); }
            }
         </style>`;
      const top10 = this.ui.highscoreService.getTop10()
         .map(({ name, score }, i) => {
            if(isNumber(this.rank) && this.rank === i) {
               const style = "animation-name: flash;" +
                  "animation-duration: 1.0s;" +
                  "animation-iteration-count: infinite;" +
                  "animation-direction: normal;" +
                  "animation-timing-function: linear;";
               return `<span style="${style}">${i+1}\t\t\t${score}\t\t\t${name}</span>`;
            }
            return `${i+1}\t\t\t${score}\t\t\t${name}`;
         });
      return animation + [header, ...top10].join("\n");
   };

   // if rank is a number it intructs to highlight that rank in the top10 list.
   public render(rank: unknown) {
      if(isNumber(rank)) {
         this.rank = rank;
      }
      this.shadeElement = createShade();

      this.title = createText({
         text: "Highscore", fontSize: 26, top: 10
      });
      centerHorizontally(this.title);

      this.top10 = createText({
         text: this.getTop10Text(), fontSize: 17, top: 40
      });
      centerHorizontally(this.top10);

      this.countdown = new Countdown({
         secondsLeft: 15,
         onDone: this.handleCountdDownDone,
         fontSize: 26,
         top: 10,
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
