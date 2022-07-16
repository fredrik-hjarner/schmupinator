import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createShade } from "./components/shade";
import { centerHorizontally } from "./utils/centering";
import { createText } from "./components/text";
import { Menu } from "./components/Menu";

type TConstructor = {
   ui: UI;
}

export class Settings implements IScene {
   public readonly ui: UI;

   // elements
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private menu?: Menu;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      const { fullscreen, gameSpeedSlider, fpsStats } = this.ui.settingsService.settings;

      this.shadeElement = createShade();

      this.title = createText({
         text: `<span class="flash3s"><span style="font-size: 76px;">S</span>ettings</span>`,
         fontSize: 60,
         top: 38,
      });
      centerHorizontally(this.title);

      this.menu = new Menu({
         top: 115,
         menuItems: [
            {
               text: `fullscreen - ${fullscreen ? "on" : "off" }`,
               onClick: () => { this.ui.settingsService.toggleSetting("fullscreen"); }
            },
            {
               text: `fpsStats - ${fpsStats ? "on" : "off" }`,
               onClick: () => { this.ui.settingsService.toggleSetting("fpsStats"); }
            },
            {
               text: `gameSpeedSlider - ${gameSpeedSlider ? "on" : "off" }`,
               onClick: () => { this.ui.settingsService.toggleSetting("gameSpeedSlider"); }
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
