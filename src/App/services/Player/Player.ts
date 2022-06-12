import type { App } from "../../App";
import type { PotentialShot } from "../Shots/PotentialShot";
import type { TCollisions } from "../Collisions/Collisions";

import {
   framesBewteenPlayerShots, playerInvincible, playerShotSpeed,
   playerSpeedPerFrame, resolutionHeight, resolutionWidth
} from "../../../consts";
import { Circle } from "../../../Circle";

export class Player {
   app: App;
   circle: Circle;
   lastShotFrame: number;

   /**
    * Public
    */
   constructor(app: App) {
      this.app = app;
      this.circle = new Circle(resolutionWidth/2, resolutionHeight-20, 20, "aqua");
      this.lastShotFrame = 0;
   }

   /**
    * Init runs after bootstrap.
    * If it needs to use things on app dont do that in the constructor
    * since the order on they are added to app makes a difference in
    * that case.
    */
   Init = () => {
      // TODO: Use this.name instead.
      this.app.events.subscribeToEvent(
         "updatePlayer",
         event => {
            switch(event.type) {
               case "frame_tick":
                  this.onFrameTick();
                  break;
               case "collisions":
                  this.onCollisions(event.collisions);
                  break;
            }
         }
      );
   };

   /**
    * Private
    */
   bound = () => {
      if(this.circle.Left < 0) {
         this.circle.Left = 0;
      } else if(this.circle.Right > resolutionWidth) {
         this.circle.Right = resolutionWidth;
      }
      if(this.circle.Top < 0) {
         this.circle.Top = 0;
      } else if (this.circle.Bottom > resolutionHeight) {
         this.circle.Bottom = resolutionHeight;
      }
   };
  
   private onCollisions = (collisions: TCollisions) => {
      /**
       * Check player death
       */
      if(!playerInvincible) {
         if(collisions.playerWasHit) {
            this.app.events.dispatchEvent({ type: "player_died" });
         }
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
         this.circle.X -= speed;
      }
      if (right) {
         this.circle.X += speed;
      }
      if (up) {
         this.circle.Y -= speed;
      }
      if (down) {
         this.circle.Y += speed;
      }
      if(input.ButtonsPressed.space || gamepad.shoot) {
         const frame = this.app.gameLoop.FrameCount;
         /**
          * Limit frequency of shots.
          */
         if(frame - this.lastShotFrame >= framesBewteenPlayerShots) {
            const spdY = -playerShotSpeed;
            const potentialShots: PotentialShot[] = [
               { x: this.circle.X, y: this.circle.Top, spdX: 0, spdY },
               { x: this.circle.X, y: this.circle.Top, spdX: 1.5, spdY },
               { x: this.circle.X, y: this.circle.Top, spdX: -1.5, spdY },
            ];
            this.app.playerShots.TryShoot(potentialShots);
            this.lastShotFrame = this.app.gameLoop.FrameCount;
         }
      }

      this.bound();
   };
}