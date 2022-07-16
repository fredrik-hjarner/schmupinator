import type { IScene } from "../IScene";
import type { UI } from "../../UI";

import { createShade } from "../components/shade";
import { centerHorizontally } from "../utils/centering";
import { createText } from "../components/text";
import { Menu } from "../components/Menu";

type TConstructor = {
   ui: UI;
}

export class StartGame implements IScene {
   public readonly ui: UI;

   // elements
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private menu?: Menu;

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

      this.menu = new Menu({
         top: 115,
         menuItems: [
            { text: "start game", onClick: this.onStartGame },
            { text: "highscore", onClick: this.onHighscore },
            { text: "settings", onClick: () => {/* */}},
         ]
      });
      this.menu.render();
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.title?.remove();
      this.title = undefined;

      this.menu?.destroy();
   }

   private onStartGame = () => {
      this.ui.gameLoop.Start();
      this.ui.SetActiveScene(this.ui.game);
   };

   private onHighscore = () => {
      this.ui.SetActiveScene(this.ui.highscore);
   };
}
