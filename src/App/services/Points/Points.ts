import type { App } from "../../App";
import type { TPointsEvent } from "../Events/IEvents";
import type { TGameEvent } from "../Events/GameEvents.ts";
import type { IPoints } from "./IPoints";

type TConstructor = {
   app: App;
   name: string
}

export class Points implements IPoints {
   private readonly app: App;
   public readonly name: string;
   public points: number;

   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.points = 0;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async () => {
      this.app.events.subscribeToEvent(this.name, this.onEvent);
      this.app.eventsPoints.subscribeToEvent(this.name, this.onEventPoints);
   };

   /**
    * Private
    */

   private onEvent = (event: TGameEvent) => {
      switch(event.type) {
         case "gameOver":
            // unsub because we dont want to get in here again.
            this.app.events.unsubscribeToEvent(this.name);
            break;
         default:
            // NOOP
      }
      return Promise.resolve(); // To make Typescript happy.
   };

   private onEventPoints = (event: TPointsEvent) => {
      switch(event.type) {
         case "add_points": {
            this.points += event.points;
            // console.log(`${event.enemy}: ${event.points}pts`);
            this.updatePoints();
            break;
         }
         default:
            // NOOP
      }
   };

   private updatePoints = () => {
      // Dispatch event so UI knows to update.
      this.app.eventsUi.dispatchEvent({ type: "uiScoreUpdated", points: this.points });
   };
}