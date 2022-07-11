import type { IScene } from "./IScene";
import type { UI } from "../UI";

import { createShade } from "./utils/shade";
import { createText } from "./utils/text";
import { createButton } from "./utils/button";
import { createInput } from "./utils/input";
import { Countdown } from "./utils/Countdown";
import { isNumber } from "../../../../utils/typeAssertions";

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
   private button?: HTMLButtonElement;
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
         text: "Made it into the Highscore", fontSize: 24, top: 10, left: 52
      });
      this.subTitle = createText({ text: "Enter your name", fontSize: 20, top: 60, left: 112 });
      this.button = createButton({
         text: "Done",
         fontSize: 20,
         top: 140,
         left: 149,
         onClick: this.handleCountdDownDone
      });
      this.input = createInput({
         placeholder: "",
         maxlength: 6,
         fontSize: 20,
         top: 99,
         left: 115
      });

      this.countdown = new Countdown({
         secondsLeft: 25,
         onDone: this.handleCountdDownDone,
         fontSize: 24,
         top: 10,
         left: 320,
      });
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
