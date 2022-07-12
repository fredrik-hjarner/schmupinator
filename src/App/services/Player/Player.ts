import type { App } from "../../App";
import type { PotentialShot } from "../Shots/PotentialShot";
import type { TCollisions } from "../Collisions/Collisions";
import type { IGraphics , THandle, TResponse_AskForElement } from "../Graphics/IGraphics";
import type { IService } from "../IService";

import {
   framesBewteenPlayerShots, playerInvincible, playerShotSpeed,
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
   private graphics!: IGraphics; // Graphics service
   private diameter: number;
   private graphicsHandle?: THandle; // handle to GraphicsElement from Graphics service.
   private lastShotFrame: number;

   /**
    * Public
    */
   public constructor(params: TConstructor) {
      this.app = params.app;
      this.name = params.name;
      this.x = resolutionWidth/2;
      this.y = resolutionHeight-20;
      this.diameter = 20;
      this.lastShotFrame = 0;
   }

   /**
    * Init runs after bootstrap.
    * If it needs to use things on app dont do that in the constructor
    * since the order on they are added to app makes a difference in
    * that case.
    */
   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async () => {
      this.graphics = this.app.graphics;
      const response =
         this.graphics.Dispatch({ type:"gfxAskForElement" }) as TResponse_AskForElement;
      this.graphicsHandle = response.handle;
      this.updateGraphicsPosition();
      this.graphics.Dispatch({
         type:"gfxSetDiameter",
         handle: this.graphicsHandle, diameter: this.diameter
      });
      this.graphics.Dispatch({
         type:"gfxSetColor",
         handle: this.graphicsHandle, color: "aqua"
      });
      this.graphics.Dispatch({
         type:"gfxSetShape",
         handle: this.graphicsHandle, shape: "diamondShield"
      });
      this.graphics.Dispatch({
         type:"gfxSetRotation",
         handle: this.graphicsHandle, degrees: 0
      });

      this.app.events.subscribeToEvent(
         this.name,
         event => {
            switch(event.type) {
               case "frame_tick":
                  this.onFrameTick(event.frameNr);
                  break;
               case "collisions":
                  this.onCollisions(event.collisions);
                  break;
            }
         }
      );
   };

   private updateGraphicsPosition = () => {
      if(this.graphicsHandle) {
         this.graphics.Dispatch({
            type:"gfxSetPosition",
            handle: this.graphicsHandle, x: this.x, y: this.y
         });
      }
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

   private onFrameTick = (frame: number) => {
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
            this.lastShotFrame = frame;
         }
      }

      this.bound();
      this.updateGraphicsPosition();
   };
}