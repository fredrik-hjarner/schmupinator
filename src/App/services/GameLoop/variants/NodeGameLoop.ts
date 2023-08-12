import type  { App } from "../../../App";
import type { IGameLoop } from "../IGameLoop";

import { BrowserDriver } from "../../../../drivers/BrowserDriver/index.ts";

type TConstructor = {
   app: App;
   name: string;
};

export class NodeGameLoop implements IGameLoop {
   // vars
   public name: string;
   public FrameCount: number;
   public frameSpeedMultiplier: number; // 1 = normal spd. 0 = paused. 2 = twice spd etc.

   // deps/services
   public app: App;

   /**
   * Public
   */
   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.FrameCount = 0;
      this.frameSpeedMultiplier = 1;
   }

   public Init = async () => {
      // noop
   };

   public Start = () => {
      BrowserDriver.SetInterval(this.oneGameLoop, 0);
   };

   public pause = () => {
      this.frameSpeedMultiplier = 0;
   };

   // Public because GameSpeed might want control over frames.
   public nextFrame = () => {
      this.FrameCount++;
      this.app.events.dispatchEvent({ type: "frame_tick", frameNr: this.FrameCount });
   };

   /**
   * Private
   */
   private advanceFrames = () => {
      if(this.frameSpeedMultiplier === 0) {
         return;
      }
      this.nextFrame();
   };

   private oneGameLoop = () => {
      if(this.frameSpeedMultiplier === 0) {
         return;
      }
      this.advanceFrames();
   };
}