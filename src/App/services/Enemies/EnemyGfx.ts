import type { Vector as TVector } from "../../../math/bezier";
import type {
   IGraphics, TGraphicsActionWithoutHandle , TResponse_AskForElement
} from "../Graphics/IGraphics";

import { BrowserDriver } from "../../../drivers/BrowserDriver";


type TConstructor = {
   graphics: IGraphics; // Graphics service;
   x: number;
   y: number;
   diameter: number;
}

export class EnemyGfx {
   private graphics: IGraphics;
   private gfxHandle: string; // handle to graphics element.

   public constructor(args: TConstructor){
      const { graphics, x, y, diameter } = args;

      this.graphics = graphics;

      this.gfxHandle =
         (this.graphics.Dispatch({ type:"gfxAskForElement" }) as TResponse_AskForElement).handle;
      this.graphics.Dispatch({ type:"gfxSetPosition", handle: this.gfxHandle, x, y });
      this.graphics.Dispatch({ type:"gfxSetDiameter", handle: this.gfxHandle, diameter });
      this.graphics.Dispatch({ type:"gfxSetColor", handle: this.gfxHandle, color: "red" });
      this.graphics.Dispatch({ type:"gfxSetShape", handle: this.gfxHandle, shape: "diamondShield"});
   }

   public setPosition = ({ x, y }: TVector) => {
      this.graphics.Dispatch({ type:"gfxSetPosition", handle: this.gfxHandle, x, y });
   };

   public release = () => {
      this.graphics.Dispatch({ type: "gfxRelease", handle: this.gfxHandle });
   };

   public setRotation = ({ degrees }: { degrees: number }) => {
      this.graphics.Dispatch({ type: "gfxSetRotation", handle: this.gfxHandle, degrees: degrees });
   };

   public dispatch = (action: TGraphicsActionWithoutHandle) => {
      switch(action.type) {
         case "gfxSetColor":
         case "gfxSetDiameter":
         case "gfxSetPosition":
         case "gfxSetRotation":
         case "gfxSetShape":
         case "gfxSetScale":
         case "gfxScrollBg":
         case "gfxFillScreen":
            this.graphics.Dispatch({ ...action, handle: this.gfxHandle });
            break;
         default:
            BrowserDriver.Alert(
               `${(action as {type: string}).type} not handled in EnemyGfx.dispatch!\n` +
               `The full offending action:\n` +
               `${JSON.stringify(action, null, 2)}`
            );
      }
   };
}