import type { IScene } from "../IScene";
import type { UI } from "../../UI";

import { createShade } from "../components/shade";
import { centerHorizontally } from "../utils/centering";
import { createText } from "../components/text";

type TConstructor = {
   ui: UI;
}

export class StartGame implements IScene {
   public readonly ui: UI;

   // elements
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private startGame?: HTMLDivElement;
   private highscore?: HTMLDivElement;
   private settings?: HTMLDivElement;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      this.shadeElement = createShade();

      this.title = createText({
         text: `<span class="flash3s"><span style="font-size: 76px;">S</span>chmupinator</span>`,
         fontSize: 60,
         top: 38,
      });
      centerHorizontally(this.title);

      this.startGame = createText({
         text: `Start game`,
         fontSize: 30,
         top: 115,
         onClick: this.onStartGame,
         className: "menuItem",
      });
      centerHorizontally(this.startGame);
      
      this.highscore = createText({
         text: `Highscore`,
         fontSize: 30,
         top: 140,
         onClick: this.onHighscore,
         className: "menuItem",
      });
      centerHorizontally(this.highscore);

      this.settings = createText({
         text: `Settings`,
         fontSize: 30,
         top: 165,
         className: "menuItem",
      });
      centerHorizontally(this.settings);
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.title?.remove();
      this.title = undefined;

      this.startGame?.remove();
      this.startGame = undefined;

      this.highscore?.remove();
      this.highscore = undefined;

      this.settings?.remove();
      this.settings = undefined;
   }

   private onStartGame = () => {
      this.ui.gameLoop.Start();
      this.ui.SetActiveScene(this.ui.game);
   };

   private onHighscore = () => {
      this.ui.SetActiveScene(this.ui.highscore);
   };
}
