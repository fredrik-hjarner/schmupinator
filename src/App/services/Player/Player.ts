import type { App } from "../../App";
import type { IService } from "../IService";

import {
   playerSpeedPerFrame, resolutionHeight, resolutionWidth
} from "../../../consts";

type TConstructor = {
   app: App;
   name: string;
}

export class Player implements IService {
   public readonly app: App;
   public readonly name: string;
   private x: number;
   private y: number;
   private diameter: number;

   /**
    * Public
    */
   public constructor(params: TConstructor) {
      this.app = params.app;
      this.name = params.name;
      this.x = resolutionWidth/2;
      this.y = resolutionHeight-20;
      this.diameter = 20;
   }

   /**
    * Init runs after bootstrap.
    * If it needs to use things on app dont do that in the constructor
    * since the order on they are added to app makes a difference in
    * that case.
    */
   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async () => {
      this.app.events.subscribeToEvent(
         this.name,
         event => {
            switch(event.type) {
               case "frame_tick":
                  this.onFrameTick();
                  break;
            }
         }
      );
   };

   public get Radius(){
      return this.diameter/2;
   }

   public get X(){ return this.x; }
   public get Y(){ return this.y; }

   public get Top(){ return this.y - this.Radius; }
   public set Top(v){ this.y = v + this.Radius; }

   public get Bottom(){ return this.y + this.Radius; }
   public set Bottom(v){ this.y = v - this.Radius; }

   public get Left(){ return this.x - this.Radius; }
   public set Left(v){ this.x = v + this.Radius; }

   public get Right(){ return this.x + this.Radius; }
   public set Right(v){ this.x = v - this.Radius; }

   /**
    * Private
    */
   private bound = () => {
      if(this.Left < 0) {
         this.Left = 0;
      } else if(this.Right > resolutionWidth) {
         this.Right = resolutionWidth;
      }
      if(this.Top < 0) {
         this.Top = 0;
      } else if (this.Bottom > resolutionHeight) {
         this.Bottom = resolutionHeight;
      }
   };

   private onFrameTick = () => {
      /**
       * Check input
       */
      const input = this.app.input;
      const gamepad = this.app.gamepad;

      let speed = playerSpeedPerFrame[0];

      const left = input.ButtonsPressed.left || gamepad.left;
      const right = input.ButtonsPressed.right || gamepad.right;
      const up = input.ButtonsPressed.up || gamepad.up;
      const down = input.ButtonsPressed.down || gamepad.down;

      const horizonal = left || right;
      const vertical = up || down;
      if(horizonal && vertical) {
      // decrease speed to not have diagonal movement be faster.
         speed /= Math.SQRT2;
      }

      if (left) {
         this.x -= speed;
      }
      if (right) {
         this.x += speed;
      }
      if (up) {
         this.y -= speed;
      }
      if (down) {
         this.y += speed;
      }

      this.bound();
      // this.updateGraphicsPosition();
   };
}