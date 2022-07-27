import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createShade } from "./components/atoms/shade";
import { createText } from "./components/atoms/text";
import { createInput } from "./components/atoms/input";
import { isNumber } from "../../../../utils/typeAssertions";
import { centerHorizontally } from "./utils/centering";
import { fontSizes } from "./consts/fontSizes";
import { Menu } from "./components/molecules/Menu";

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
   private input?: HTMLInputElement;
   private menu?: Menu;
   
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

      this.menu = new Menu({
         input: this.ui.input,
         top: 165,
         menuItems: [
            {
               text: "Done",
               onClick: this.handleCountdDownDone
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

      this.subTitle?.remove();
      this.subTitle = undefined;

      this.input?.remove();
      this.input = undefined;
      
      this.menu?.destroy();
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
