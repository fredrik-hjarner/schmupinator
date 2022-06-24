import type { Vector as TVector } from "../../../math/bezier";
import type { IGraphics } from "../Graphics/IGraphics";

import { TResponse_AskForElement } from "../Graphics/IGraphics";

type TConstructor = {
   graphics: IGraphics; // Graphics service;
   x: number;
   y: number;
   diameter: number;
}

export class EnemyGfx {
   private graphics: IGraphics;
   // TODO: Should be private, maybe.
   public gfxHandle: string; // handle to graphics element.

   constructor(args: TConstructor){
      const { graphics, x, y, diameter } = args;

      this.graphics = graphics;
      const response =
         this.graphics.Dispatch({ type:"gfxAskForElement" }) as TResponse_AskForElement;
      this.gfxHandle = response.handle;
      this.graphics.Dispatch({
         type:"gfxSetPosition",
         handle: this.gfxHandle, x, y
      });
      this.graphics.Dispatch({
         type:"gfxSetDiameter",
         handle: this.gfxHandle, diameter
      });
      this.graphics.Dispatch({
         type:"gfxSetColor",
         handle: this.gfxHandle, color: "red"
      });
      this.graphics.Dispatch({
         type:"gfxSetShape",
         handle: this.gfxHandle, shape: "diamondShield"
      });

      this.updateDisplayHealth(1);
   }

   public setPosition = ({ x, y }: TVector) => {
      this.graphics.Dispatch({ type:"gfxSetPosition", handle: this.gfxHandle, x, y });
   };

   public release = () => {
      this.graphics.Dispatch({ type: "gfxRelease", handle: this.gfxHandle });
   };

   public updateDisplayHealth = (factorHealthLeft: number) => {
      this.graphics.Dispatch({
         type:"gfxSetHealth",
         handle: this.gfxHandle, healthFactor: factorHealthLeft
      });
   };
}