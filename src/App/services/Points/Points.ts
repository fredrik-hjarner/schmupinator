import type { App } from "../../App";
import type { TEvent } from "../Events/Events";
import type { IService } from "../IService";

import { isHTMLDivElement } from "../../../utils/typeAssertions";
import { initPointsElement } from "./pointsElement";

type TConstructor = {
   app: App;
   name: string
}

export class Points implements IService {
   app: App;
   name: string;
   points: number;
   pointsElement: unknown;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.points = 0;
      this.pointsElement = initPointsElement();
   }

   Init = () => {
      this.app.events.subscribeToEvent(this.name, this.onEvent);
   };

   /**
    * Private
    */

   private onEvent = (event: TEvent) => {
      switch(event.type) {
         case "add_points": {
            this.points += event.points;
            this.updatePoints();
            break;
         }
         case "player_missed_bullet": {
            this.points--;
            this.updatePoints();
            break;
         }
      }
   };

   private updatePoints = () => {
      if(isHTMLDivElement(this.pointsElement)) {
         this.pointsElement.innerHTML = `${this.points}`;
      }
   };
}