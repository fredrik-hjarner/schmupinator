import type { IScene } from "./IScene";
import type { UI } from "../UI";

import { createShade } from "./components/shade";
import { createButton } from "./components/button";
import { centerHorizontally } from "./utils/centering";
import { createText } from "./components/text";

type TConstructor = {
   ui: UI;
}

export class StartGame implements IScene {
   public readonly ui: UI;

   // elements
   private title?: HTMLDivElement;
   private button?: HTMLButtonElement;
   private shadeElement?: HTMLDivElement;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      this.shadeElement = createShade();

      this.title = createText({
         text: `<span class="flash3s"><span style="font-size: 76px;">S</span>chmupinator</span>`,
         fontSize: 60,
         top: 20,
      });
      centerHorizontally(this.title);

      this.button = createButton({
         text: "Start game",
         fontSize: 22,
         top: 120,
         padding: "5px 10px",
         onClick: this.startGame
      });
      centerHorizontally(this.button);
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.title?.remove();
      this.title = undefined;

      this.button?.remove();
      this.button = undefined;
   }

   private startGame = () => {
      this.ui.gameLoop.Start();
      this.ui.SetActiveScene(this.ui.game);
   };
}
