import type { IScene } from "./types/IScene";
import type { UI } from "../UI";
import type { TSettings } from "../../Settings/Settings";

import { createShade } from "./components/atoms/shade";
import { centerHorizontally } from "./utils/centering";
import { createText } from "./components/atoms/text";
import { Menu } from "./components/molecules/Menu";

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
      const {
         fullscreen, gameSpeedSlider, fpsStats, outsideHider, autoplay
      } = this.ui.settingsService.settings;

      this.shadeElement = createShade();

      this.title = createText({
         text: `<span class="flash3s"><span style="font-size: 76px;">S</span>ettings</span>`,
         fontSize: 60,
         top: 25,
      });
      centerHorizontally(this.title);

      this.menu = new Menu({
         input: this.ui.input,
         top: 85,
         menuItems: [
            {
               text: `fullscreen - ${fullscreen ? "on" : "off" }`,
               onClick: () => { this.toggleSetting("fullscreen"); }
            },
            {
               text: `fpsStats - ${fpsStats ? "on" : "off" }`,
               onClick: () => { this.toggleSetting("fpsStats"); }
            },
            {
               text: `gameSpeedSlider - ${gameSpeedSlider ? "on" : "off" }`,
               onClick: () => { this.toggleSetting("gameSpeedSlider"); }
            },
            {
               text: `outsideHider - ${outsideHider ? "on" : "off" }`,
               onClick: () => { this.toggleSetting("outsideHider"); }
            },
            {
               text: `autoplay - ${autoplay ? "on" : "off" }`,
               onClick: () => { this.toggleSetting("autoplay"); }
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

   private toggleSetting = (setting: keyof TSettings) => {
      this.ui.settingsService.toggleSetting(setting);
      this.refresh(); // refresh to values are up-to-date.
   };

   /**
    * When I have updated a setting I need to refresh so that new values can be seen,
    * so that the values are up-to-date.
    */
   private refresh = () => {
      this.destroy();
      this.render();
   };
}
