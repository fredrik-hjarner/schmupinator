import type { Shots } from "./Shots";

import { resolutionHeight, resolutionWidth } from "../../../consts";
import { Circle } from "../../../Circle";

type TConstructor = {
   shotsService: Shots,
   x: number,
   y: number,
   spdX: number;
   spdY: number;
   active: boolean;
   color: string;
}

export class Shot {
   shotsService: Shots;
   origX: number;
   origY: number;
   circle: Circle;
   spdX: number;
   spdY: number;
   active: boolean;

   /**
    * Public
    */
   constructor({ shotsService, x, y, spdX, spdY, active, color }: TConstructor) {
      this.shotsService = shotsService;
      this.origX = x;
      this.origY = y;
      this.circle = new Circle(x, y, 6, color);
      this.spdX = spdX;
      this.spdY = spdY;
      this.active = active;
   }
  
   Update = () => {
      if(!this.active) {
         return;
      }
      this.circle.X += this.spdX;
      this.circle.Y += this.spdY;
      this.bound();
   };

   /**
    * Private
    */
   destroy = () => {
      // Inactivate and set back at resting place.
      this.active = false;
      this.circle.X = this.origX;
      this.circle.Y = this.origY;
      /**
       * TODO: Not super nic to look at the name like this.
       */
      if(this.shotsService.name === "playerShots") {
         this.shotsService.app.events.dispatchEvent({ type: "player_missed_bullet" });
      }
   };

   bound = () => {
      if(this.circle.Left < 0) {
         this.destroy();
      } else if(this.circle.Right > resolutionWidth) {
         this.destroy();
      }
      if(this.circle.Top < 0) {
         this.destroy();
      } else if (this.circle.Bottom > resolutionHeight) {
         this.destroy();
      }
   };
}