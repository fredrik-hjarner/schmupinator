import type { IScene } from "./IScene";
import type { UI } from "../UI";

import { createShade } from "./components/shade";
import { createText } from "./components/text";
import { createInput } from "./components/input";
import { Countdown } from "./components/Countdown";
import { isNumber } from "../../../../utils/typeAssertions";
import { centerHorizontally } from "./utils/centering";
import { fontSizes } from "./consts/fontSizes";

type TConstructor = {
   ui: UI;
}

export class EnterHighscore implements IScene {
   // deps/services
   public readonly ui: UI;

   // vars
   private rank?: number;

   // elements
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private subTitle?: HTMLDivElement;
   private button?: HTMLDivElement;
   private input?: HTMLInputElement;
   private countdown?: Countdown;
   
   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }
   
   // If rank is a number then that's the rank the player got in top10 list.
   public render(rank?: unknown) {
      if(isNumber(rank)) {
         this.rank = rank;
      }
      
      this.shadeElement = createShade();
      
      this.title = createText({
         text: "Made it into the Highscore",
         fontSize: fontSizes.normal,
         top: 10,
         className: "flash1s"
      });
      centerHorizontally(this.title);
      
      this.countdown = new Countdown({
         secondsLeft: 25,
         onDone: this.handleCountdDownDone,
         fontSize: fontSizes.normal,
         top: 10,
         left: 320,
         className: "flash1s"
      });

      this.subTitle = createText({
         text: "Enter thy name and\n become a legend",
         fontSize: fontSizes.small,
         top: 58,
         className: "flash1s"
      });
      centerHorizontally(this.subTitle);

      this.input = createInput({
         placeholder: "",
         maxlength: 6,
         fontSize: 20,
         top: 119,
      });
      centerHorizontally(this.input);

      this.button = createText({
         text: "Done",
         fontSize: fontSizes.normal,
         top: 165,
         onClick:  this.handleCountdDownDone,
         className: "menuItem",
      });
      centerHorizontally(this.button);
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

      this.countdown?.destroy();
      this.countdown = undefined;
   }

   private handleCountdDownDone = () => {
      // Enter entry then go to Highscore screen.
      this.ui.highscoreService.registerNewEntry({
         // TODO: Dont allow no name?
         name: this.input?.value || "ANON",
         score: this.ui.points.points
      });
      this.ui.SetActiveScene(this.ui.highscore, this.rank);
   };
}
