import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createShade } from "./components/atoms/shade.ts";
import { createText } from "./components/atoms/text.ts";
import { BrowserDriver } from "../../../../drivers/BrowserDriver/index.ts";
import { isBoolean, isNumber, isObject } from "../../../../utils/typeAssertions.ts";
import { centerHorizontally } from "./utils/centering.ts";
import { fontSizes } from "./consts/fontSizes.ts";
import { pad } from "../../../../utils/formatting/pad.ts";
import { Menu } from "./components/molecules/Menu.ts";

type TConstructor = {
   ui: UI;
}

export class Highscore implements IScene {
   // deps/services
   public readonly ui: UI;

   // vars
   /**
    * rank to flash, your score.
    */
   private rank?: number;
   /**
    * If the button in the bottom should be a "back" button instead of "continue" button.
    */
   private backButton = false;

   // elements
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private top10?: HTMLDivElement;
   private menu?: Menu;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   // helper functions.
   private padRank = (text: string) => pad(text, 10);
   private padScore = (text: string) => pad(text, 11);

   private getTop10Text = (): string => {

      const header = this.padRank("rank") + this.padScore("Score") + "Player";
      const top10 = this.ui.highscoreService.getTop10()
         .map(({ name, score }, i) => {
            const rnk = this.padRank(`${i+1}`);
            const scr = this.padScore(`${score}`);
            if(isNumber(this.rank) && this.rank === i) {
               return `<span class="flash1s">${rnk}${scr}${name}</span>`;
            }
            return `${rnk}${scr}${name}`;
         });
      return [header, ...top10].join("\n");
   };

   // if rank is a number it intructs to highlight that rank in the top10 list.
   public render(props: unknown) {
      if(isObject(props)) {
         if(isNumber(props.rank)) {
            this.rank = props.rank;
         }
         if(isBoolean(props.backButton)) {
            this.backButton = props.backButton;
         }
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

      this.menu = new Menu({
         input: this.ui.input,
         top: 207,
         menuItems: [
            {
               text: this.backButton ? "back" : "continue",
               onClick: this.handleExit
            },
         ]
      });
      this.menu.render();
   }

   public destroy() {
      // reset vars
      this.rank = undefined;
      this.backButton = false;

      // remove elements

      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.title?.remove();
      this.title = undefined;

      this.top10?.remove();
      this.top10 = undefined;

      this.menu?.destroy();
   }

   private handleExit = () => {
      if(this.backButton) {
         this.ui.SetActiveScene(this.ui.startGame);
         return;
      }

      BrowserDriver.WithWindow(window => {
         // TODO: reload just because app does not clear up by itself yet.
         window.location.reload();
         // this.ui.SetActiveScene(this.ui.startGame);
      });
   };
}
