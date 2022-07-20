import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createShade } from "./components/shade";
import { centerHorizontally } from "./utils/centering";
import { createText } from "./components/text";
import { Menu } from "./components/Menu";
import { List } from "./components/List";

type TConstructor = {
   ui: UI;
}

export class Controls implements IScene {
   public readonly ui: UI;

   // elements
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private menu?: Menu;
   private list?: List;

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

      this.list = new List({
         top: 105,
         items: [
            { text: `move - arrow keys` },
            { text: `shoot - space` },
            { text: `laser - ctrl` }
         ]
      });
      this.list.render();

      this.menu = new Menu({
         top: 105 + 25*3,
         menuItems: [
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

      this.list?.destroy();
      this.menu?.destroy();
   }
}
