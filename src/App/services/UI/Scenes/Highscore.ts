import type { IScene } from "./IScene";
import type { UI } from "../UI";

import { createShade } from "./utils/shade";
import { createText } from "./utils/text";
import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { Countdown } from "./utils/Countdown";
import { isNumber } from "../../../../utils/typeAssertions";

type TConstructor = {
   ui: UI;
}

export class Highscore implements IScene {
   readonly ui: UI;
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private top10?: HTMLDivElement;
   private countdown?: Countdown;

   constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   private getTop10Text = (): string => {
      const header = `Rank\t\t\tScore\t\t\tPlayer`;
      const top10 = this.ui.highscoreService.getTop10()
         .map(({ name, score }, i) => `${i+1}\t\t\t\t${score}\t\t\t\t${name}`);
      return [header, ...top10].join("\n");
   };

   // if rank is a number it intructs to highlight that rank in the top10 list.
   public render(rank: unknown) {
      if(isNumber(rank)) {
         // TODO: Implement highlight of last added highscore.
         console.log(`Should highligh rank ${rank}`);
      }
      this.shadeElement = createShade();
      this.title = createText({text: "Highscore", fontSize: 24, top: 10, left: 128 });
      this.top10 = createText({
         text: this.getTop10Text(), fontSize: 15, top: 40, left: 40
      });

      this.countdown = new Countdown({
         secondsLeft: 10,
         onDone: this.handleCountdDownDone,
         fontSize: 24,
         top: 10,
         left: 300,
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
