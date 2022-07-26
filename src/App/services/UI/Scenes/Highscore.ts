import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createShade } from "./components/atoms/shade";
import { createText } from "./components/atoms/text";
import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { Countdown } from "./components/molecules/Countdown";
import { isNumber } from "../../../../utils/typeAssertions";
import { centerHorizontally } from "./utils/centering";
import { fontSizes } from "./consts/fontSizes";
import { pad } from "../../../../utils/formatting/pad";
import { Menu } from "./components/molecules/Menu";

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
   private menu?: Menu;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   private getTop10Text = (): string => {
      const padRank = (text: string) => pad(text, 10);
      const padScore = (text: string) => pad(text, 11);

      const header = padRank("rank") + padScore("Score") + "Player";
      const top10 = this.ui.highscoreService.getTop10()
         .map(({ name, score }, i) => {
            const rnk = padRank(`${i+1}`);
            const scr = padScore(`${score}`);
            if(isNumber(this.rank) && this.rank === i) {
               return `<span class="flash1s">${rnk}${scr}${name}</span>`;
            }
            return `${rnk}${scr}${name}`;
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
         text: this.getTop10Text(),
         fontSize: fontSizes.smaller,
         top: 38,
      });
      centerHorizontally(this.top10);

      this.countdown = new Countdown({
         secondsLeft: 15,
         onDone: this.handleCountdDownDone,
         fontSize: fontSizes.large,
         top: 5,
         left: 315,
      });

      this.menu = new Menu({
         top: 207,
         menuItems: [
            {
               text: "back",
               onClick: () => { this.ui.SetActiveScene(this.ui.startGame); }
            },
         ]
      });
      this.menu.render();
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

      this.menu?.destroy();
   }

   private handleCountdDownDone = () => {
      BrowserDriver.WithWindow(window => {
         // TODO: reload just because app does not clear up by itself yet.
         window.location.reload();
         // this.ui.SetActiveScene(this.ui.startGame);
      });
   };
}
