import type { App } from "../../App";
import type { PotentialShot } from "../Shots/PotentialShot";
import type { TCollisions } from "../Collisions/Collisions";
import type { Graphics, THandle, TResponse_AskForElement } from "../Graphics/Graphics";

import {
   framesBewteenPlayerShots, playerInvincible, playerShotSpeed,
   playerSpeedPerFrame, resolutionHeight, resolutionWidth
} from "../../../consts";

export class Player {
   app: App;
   private x: number;
   private y: number;
   private graphics!: Graphics; // Graphics service
   private diameter: number;
   private graphicsHandle?: THandle; // handle to GraphicsElement from Graphics service.
   private lastShotFrame: number;

   /**
    * Public
    */
   constructor(app: App) {
      this.app = app;
      this.x = resolutionWidth/2;
      this.y = resolutionHeight-20;
      this.diameter = 20;
      this.lastShotFrame = 0;
   }

   private updateGraphicsPosition = () => {
      if(this.graphicsHandle) {
         this.graphics.Dispatch({
            type:"actionSetPosition",
            payload: { handle: this.graphicsHandle, x: this.x, y: this.y }
         });
      }
   };

   public get Radius(){
      return this.diameter/2;
   }

   get X(){ return this.x; }
   get Y(){ return this.y; }

   get Top(){ return this.y - this.Radius; }
   set Top(v){ this.y = v + this.Radius; }

   get Bottom(){ return this.y + this.Radius; }
   set Bottom(v){ this.y = v - this.Radius; }

   get Left(){ return this.x - this.Radius; }
   set Left(v){ this.x = v + this.Radius; }

   get Right(){ return this.x + this.Radius; }
   set Right(v){ this.x = v - this.Radius; }

   /**
    * Init runs after bootstrap.
    * If it needs to use things on app dont do that in the constructor
    * since the order on they are added to app makes a difference in
    * that case.
    */
   Init = () => {
      this.graphics = this.app.graphics;
      const response =
         this.graphics.Dispatch({ type:"actionAskForElement" }) as TResponse_AskForElement;
      this.graphicsHandle = response.handle;
      this.updateGraphicsPosition();
      this.graphics.Dispatch({
         type:"actionSetDiameter",
         payload: { handle: this.graphicsHandle, diameter: this.diameter }
      });
      this.graphics.Dispatch({
         type:"actionSetHealth",
         payload: { handle: this.graphicsHandle, healthFactor: 1 }
      });

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
      if(input.ButtonsPressed.space || gamepad.shoot) {
         const frame = this.app.gameLoop.FrameCount;
         /**
          * Limit frequency of shots.
          */
         if(frame - this.lastShotFrame >= framesBewteenPlayerShots) {
            const spdY = -playerShotSpeed;
            const potentialShots: PotentialShot[] = [
               { x: this.x, y: this.Top, spdX: 0, spdY },
               { x: this.x, y: this.Top, spdX: 1.5, spdY },
               { x: this.x, y: this.Top, spdX: -1.5, spdY },
            ];
            this.app.playerShots.TryShoot(potentialShots);
            this.lastShotFrame = this.app.gameLoop.FrameCount;
         }
      }

      this.bound();
      this.updateGraphicsPosition();
   };
}