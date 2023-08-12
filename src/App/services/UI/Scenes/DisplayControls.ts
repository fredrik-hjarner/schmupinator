import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createBgImage } from "./components/atoms/bgImage.ts";
import { Countdown } from "./components/molecules/Countdown.ts";
import { fontSizes } from "./consts/fontSizes.ts";

type TConstructor = {
   ui: UI;
}

export class DisplayControls implements IScene {
   public readonly ui: UI;

   // elements
   private bgImageElement?: HTMLDivElement;
   private countdown?: Countdown;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      if(this.ui.settingsService.settings.skipStartMenu) {
         // Yea, just skip this scene.
         this.handleCountdDownDone();
         return;
      }

      this.bgImageElement = createBgImage(this.ui.gameData.getStartScreenImageUrl());

      this.countdown = new Countdown({
         input: this.ui.input,
         secondsLeft: 6,
         onDone: this.handleCountdDownDone,
         fontSize: fontSizes.large,
         top: 5,
         left: 315,
      });
   }

   public destroy() {
      this.bgImageElement?.remove();
      this.bgImageElement = undefined;

      this.countdown?.destroy();
      this.countdown = undefined;
   }

   private handleCountdDownDone = () => {
      this.ui.gameLoop.Start();
      this.ui.SetActiveScene(this.ui.game);
   };
}
