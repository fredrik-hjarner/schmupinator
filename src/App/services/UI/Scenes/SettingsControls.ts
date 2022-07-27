import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createShade } from "./components/atoms/shade";
import { centerHorizontally } from "./utils/centering";
import { createText } from "./components/atoms/text";
import { Menu } from "./components/molecules/Menu";
import { ShowControls } from "./components/molecules/ShowControls";

type TConstructor = {
   ui: UI;
}

export class SettingsControls implements IScene {
   public readonly ui: UI;

   // elements
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private menu?: Menu;
   private showControls?: ShowControls;

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

      this.showControls = new ShowControls({ top: 105 });
      this.showControls.render();

      this.menu = new Menu({
         input: this.ui.input,
         top: 105 + 25*4,
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

      this.showControls?.destroy();
      this.menu?.destroy();
   }
}
