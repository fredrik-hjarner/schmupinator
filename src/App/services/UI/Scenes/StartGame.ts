import type { IScene } from "./IScene";
import type { UI } from "../UI";

import { createShade } from "./components/shade";
import { createButton } from "./components/button";
import { center } from "./utils/centering";

type TConstructor = {
   ui: UI;
}

export class StartGame implements IScene {
   public readonly ui: UI;

   // elements
   private button?: HTMLButtonElement;
   private shadeElement?: HTMLDivElement;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      this.shadeElement = createShade();
      this.button = createButton({
         text: "Start game",
         fontSize: 22,
         padding: "5px 10px",
         onClick: this.startGame
      });
      center(this.button);
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.button?.remove();
      this.button = undefined;
   }

   private startGame = () => {
      this.ui.gameLoop.Start();
      this.ui.SetActiveScene(this.ui.game);
   };
}
