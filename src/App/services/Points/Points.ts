import type { App } from "../../App";
import type { TGameEvent } from "../Events/IEvents";
import type { IPoints, THistoryEntry } from "./IPoints";

import { IsBrowser } from "../../../drivers/BrowserDriver";

type TConstructor = {
   app: App;
   name: string
}

export class Points implements IPoints {
   private readonly app: App;
   public readonly name: string;
   public points: number;
   public history: Partial<{ [frame: number]: THistoryEntry }>;

   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.points = 0;
      this.history = {};
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async () => {
      this.app.events.subscribeToEvent(this.name, this.onEvent);
   };

   /**
    * Private
    */

   private onEvent = (event: TGameEvent) => {
      switch(event.type) {
         case "add_points": {
            this.points += event.points;
            // console.log(`${event.enemy}: ${event.points}pts`);
            const frame = this.app.gameLoop.FrameCount;
            this.history[frame] = { points: event.points, reason: event.enemy };
            this.updatePoints();
            break;
         }
         case "player_died":
            // unsub because we dont want to get in here again.
            this.app.events.unsubscribeToEvent(this.name);

            if(IsBrowser()) {
               console.log("Points.history:");
               console.log(this.history);
            }
            break;
      }
   };

   private updatePoints = () => {
      // Dispatch event so UI knows to update.
      this.app.uiEvents.dispatchEvent({ type: "uiScoreUpdated", points: this.points });
   };
}