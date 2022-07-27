import type { IScene } from "./types/IScene";
import type { TUiEvent } from "../../Events/IEvents";
import type { UI } from "../UI";

import { createText } from "./components/atoms/text";
import { fontSizes } from "./consts/fontSizes";

type TConstructor = {
   ui: UI;
}

export class Game implements IScene {
   //deps/services
   public readonly ui: UI;

   // elements.
   private scoreElement?: HTMLDivElement;
   private hiscoreElement?: HTMLDivElement;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      this.scoreElement = createText({
         text: "Score 0",
         color: "white",
         fontSize: fontSizes.smallest,
         top: 10,
         left: 20
      });

      const record = this.ui.highscoreService.getTop1().score;
      this.hiscoreElement = createText({
         text: `Record ${record}`,
         color: "white",
         fontSize: fontSizes.smallest,
         top: 10,
         left: 285
      });

      this.ui.eventsUi.subscribeToEvent("GameUI", this.onEvent);
   }

   public destroy() {
      this.scoreElement?.remove();
      this.scoreElement = undefined;

      this.hiscoreElement?.remove();
      this.hiscoreElement = undefined;

      this.ui.events.unsubscribeToEvent("GameUI");
   }

   private onEvent = (event: TUiEvent) => {
      switch(event.type) {
         case "uiScoreUpdated": {
            if(this.scoreElement) {
               this.scoreElement.innerHTML = `Score ${Math.round(event.points)}`;
            }
            break;
         }
      }
   };
}
