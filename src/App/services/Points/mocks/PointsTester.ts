import type { App } from "../../../App";
import type { TGameEvent } from "../../Events/IEvents";
import type { IPoints, THistoryEntry } from "../IPoints";

import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { Points } from "../Points";
import { history } from "./history";

type TConstructor = {
   app: App;
   name: string
}

export class PointsTester implements IPoints {
   app: App;
   name: string;
   pointsService: Points;
   public history: Partial<{ [frame: number]: THistoryEntry }>;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.history = history;
      this.pointsService = new Points({ app: this.app, name: "points" });
   }

   get points() {
      return this.pointsService.points;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   Init = async () => {
      await this.pointsService.Init();
      // Subscribe to events after the original points service.
      this.app.events.subscribeToEvent(this.name, this.onEvent);
   };

   /**
    * Private
    */

   private onEvent = (event: TGameEvent) => {
      // Assumption that the original points have run at this time.
      switch(event.type) {
         case "frame_tick": {
            const frame = this.app.gameLoop.FrameCount;
            const expected = this.history[frame] as THistoryEntry | undefined;
            const expectedStr = JSON.stringify(expected);
            const actual = this.pointsService.history[frame] as THistoryEntry | undefined;
            const actualStr = JSON.stringify(actual);
            if(expectedStr !== actualStr) {
               BrowserDriver.Alert(
                  `Test failed!\nFrame: ${frame}\nExpected: ${expectedStr}\nActual: ${actualStr}`
               );
            }
            break;
         }
      }
   };
}