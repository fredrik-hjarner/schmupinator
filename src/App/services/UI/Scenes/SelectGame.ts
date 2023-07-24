import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createShade } from "./components/atoms/shade";
import { centerHorizontally } from "./utils/centering";
import { createText } from "./components/atoms/text";
import { Menu } from "./components/molecules/Menu";

type TConstructor = {
   ui: UI;
}

export class SelectGame implements IScene {
   public readonly ui: UI;

   // elements
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private menu?: Menu;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      if(this.ui.settingsService.settings.skipStartMenu) {
         // Yea, just skip this menu.
         this.onSelectGame(0);
         return;
      }

      this.shadeElement = createShade();

      this.title = createText({
         text: `<span class="flash3s"><span style="font-size: 76px;">S</span>elect game</span>`,
         fontSize: 60,
         top: 36,
      });
      centerHorizontally(this.title);

      const games = this.ui.gameData.getGameNames()
         .map((game, i) => (
            {
               text: game,
               onClick: () => {
                  this.onSelectGame(i);
               }
            }
         ));

      this.menu = new Menu({
         input: this.ui.input,
         top: 108,
         menuItems: [
            ...games,
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

      this.menu?.destroy();
   }

   private onSelectGame = (gameName: number) => {
      this.ui.gameData.setActiveGame(gameName);
      /**
       * TODO: Should display controls for the current game,
       * but currently I have no support for such game specific control screens.
       */
      this.ui.SetActiveScene(this.ui.displayControls);
   };
}
