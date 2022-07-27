import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createShade } from "./components/atoms/shade";
import { ShowControls } from "./components/molecules/ShowControls";
import { Countdown } from "./components/molecules/Countdown";
import { fontSizes } from "./consts/fontSizes";

type TConstructor = {
   ui: UI;
}

export class DisplayControls implements IScene {
   public readonly ui: UI;

   // elements
   private shadeElement?: HTMLDivElement;
   private countdown?: Countdown;
   private showControls?: ShowControls;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      this.shadeElement = createShade();

      this.countdown = new Countdown({
         secondsLeft: 5,
         onDone: this.handleCountdDownDone,
         fontSize: fontSizes.large,
         top: 5,
         left: 315,
      });

      this.showControls = new ShowControls({ top: 80 });
      this.showControls.render();
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.countdown?.destroy();
      this.countdown = undefined;

      this.showControls?.destroy();
   }

   private handleCountdDownDone = () => {
      this.ui.gameLoop.Start();
      this.ui.SetActiveScene(this.ui.game);
   };
}
