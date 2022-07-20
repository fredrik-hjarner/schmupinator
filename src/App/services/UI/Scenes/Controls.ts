import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createShade } from "./components/shade";
import { centerHorizontally } from "./utils/centering";
import { createText } from "./components/text";
import { Menu } from "./components/Menu";

type TConstructor = {
   ui: UI;
}

export class Controls implements IScene {
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
         text: `<span class="flash3s"><span style="font-size: 76px;">C</span>ontrols</span>`,
         fontSize: 60,
         top: 38,
      });
      centerHorizontally(this.title);

      this.menu = new Menu({
         top: 105,
         menuItems: [
            {
               text: `move - arrow keys`,
               onClick: () => { /* */ }
            },
            {
               text: `shoot - space`,
               onClick: () => { /* */ }
            },
            {
               text: `laser - ctrl`,
               onClick: () => { /* */ }
            },
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
}
