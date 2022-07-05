import type { App } from "../../App";
import type { TEvent } from "../Events/IEvents";
import type { IPoints, THistoryEntry } from "./IPoints";

import { isHTMLDivElement } from "../../../utils/typeAssertions";
import { initPointsElement } from "./pointsElement";
import { IsBrowser } from "../../../drivers/BrowserDriver";

type TConstructor = {
   app: App;
   name: string
}

export class Points implements IPoints {
   app: App;
   name: string;
   points: number;
   public history: Partial<{ [frame: number]: THistoryEntry }>;
   private pointsElement: unknown;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.points = 0;
      this.pointsElement = initPointsElement();
      this.history = {};
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   Init = async () => {
      this.app.events.subscribeToEvent(this.name, this.onEvent);
   };

   /**
    * Private
    */

   private onEvent = (event: TEvent) => {
      switch(event.type) {
         case "add_points": {
            this.points += event.points;
            // console.log(`${event.enemy}: ${event.points}pts`);
            const frame = this.app.gameLoop.FrameCount;
            this.history[frame] = { points: event.points, reason: event.enemy };
            this.updatePoints();
            break;
         }
         case "player_missed_bullet": {
            this.points--;
            const frame = this.app.gameLoop.FrameCount;
            this.history[frame] = { points: -1, reason: "player_missed_bullet" };
            this.updatePoints();
            break;
         }
         case "player_died":
            if(IsBrowser()) {
               console.log("Points.history:");
               console.log(this.history);
            }
            break;
      }
   };

   private updatePoints = () => {
      if(isHTMLDivElement(this.pointsElement)) {
         this.pointsElement.innerHTML = `${this.points}`;
      }
   };
}