import type { Shots } from "./Shots";
import type { IGraphics, THandle, TResponse_AskForElement } from "../Graphics/IGraphics";
import type { App } from "../../App";

import { resolutionHeight, resolutionWidth } from "../../../consts";

type TConstructor = {
   app: App;
   shotsService: Shots,
   x: number,
   y: number,
   spdX: number;
   spdY: number;
   color: string;
}

export class Shot {
   app: App;
   shotsService: Shots;
   origX: number;
   origY: number;
   spdX: number;
   spdY: number;
   private x: number;
   private y: number;
   private graphics!: IGraphics; // Graphics service
   private diameter: number;
   private graphicsHandle?: THandle; // handle to GraphicsElement from Graphics service.

   /**
    * Public
    */
   constructor({ app, shotsService, x, y, spdX, spdY, color }: TConstructor) {
      this.app = app;
      this.shotsService = shotsService;
      this.origX = x;
      this.origY = y;
      this.diameter = 6;
      this.x = x;
      this.y = y;
      this.spdX = spdX;
      this.spdY = spdY;

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
      this.graphics.Dispatch({
         type:"actionSetColor",
         payload: { handle: this.graphicsHandle, color }
      });
   }

   // Public is this case is a hack. It is used in TryShoot from the outside.
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
   set X(v){ this.x = v; }
   
   get Y(){ return this.y; }
   set Y(v){ this.y = v; }

   get Top(){ return this.y - this.Radius; }
   set Top(v){ this.y = v + this.Radius; }

   get Bottom(){ return this.y + this.Radius; }
   set Bottom(v){ this.y = v - this.Radius; }

   get Left(){ return this.x - this.Radius; }
   set Left(v){ this.x = v + this.Radius; }

   get Right(){ return this.x + this.Radius; }
   set Right(v){ this.x = v - this.Radius; }

   Update = () => {
      this.x += this.spdX;
      this.y += this.spdY;
      this.bound();
      this.updateGraphicsPosition();
   };

   /**
    * Private
    */
   destroy = () => {
      // Set back at resting place. // TODO: Update this code.
      this.x = this.origX;
      this.y = this.origY;
      /**
       * TODO: Not super nice to look at the name like this.
       */
      if(this.shotsService.name === "playerShots") {
         this.shotsService.app.events.dispatchEvent({ type: "player_missed_bullet" });
      }
      // Remove from Shots service.
      this.shotsService.shots = this.shotsService.shots.filter(s => s !== this);
      if(this.graphicsHandle) {
         this.graphics.Dispatch({
            type: "actionRelease",
            payload: { handle: this.graphicsHandle }
         });
         this.graphicsHandle = undefined;
      }
   };

   bound = () => {
      if(this.Left < 0) {
         this.destroy();
      } else if(this.Right > resolutionWidth) {
         this.destroy();
      }
      if(this.Top < 0) {
         this.destroy();
      } else if (this.Bottom > resolutionHeight) {
         this.destroy();
      }
   };
}