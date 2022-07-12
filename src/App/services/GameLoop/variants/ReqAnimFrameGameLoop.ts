import type  { App } from "../../../App";

import { millisPerFrame } from "../../../../consts";
import { IGameLoop } from "../IGameLoop";
import { BrowserDriver } from "../../../../drivers/BrowserDriver";

type TConstructor = {
   app: App;
   name: string;
};

export class ReqAnimFrameGameLoop implements IGameLoop {
   public app: App;
   public name: string;
   public FrameCount: number;
   private nextFrameMillis: number | null;

   /**
   * Public
   */
   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.FrameCount = 0;
      this.nextFrameMillis = null;
   }

   public Init = async () => {
      // noop
   };

   public Start = () => {
      this.nextFrameMillis = BrowserDriver.PerformanceNow() + millisPerFrame;
      BrowserDriver.RequestAnimationFrame(this.oneGameLoop);
   };

   /**
   * Private
   */
   private nextFrame = () => {
      const gameSpeed = this.app.gameSpeed.GameSpeed;
      for(let i=0; i<gameSpeed; i++) {
         this.FrameCount++;
         this.app.events.dispatchEvent({ type: "frame_tick", frameNr: this.FrameCount });
      }
   };

   /**
   * This may not actually progress the game one frame.
   * Idea is to run these as fast as possible and to only progress a frame
   * when one frame has passed.
   */
   private oneGameLoop = (time: number) => {
      // console.log("time:", time);
      BrowserDriver.RequestAnimationFrame(this.oneGameLoop);
      if(this.nextFrameMillis === null) {
         BrowserDriver.Alert("this.nextFrameMillis === null");
         throw new Error("this.nextFrameMillis === null");
      }
      // let i = 0;
      /**
       * uncomment to log the "drift". if requestAnimationFrame is faster or slower than 60 hz
       * (and also not an even multiple) then the number will increase or decrease, if 60hx exactly
       * the the number will be the same.
       */
      // console.log(time - this.nextFrameMillis);
      while (time >= this.nextFrameMillis) {
         // i++;
         this.nextFrameMillis += millisPerFrame;
         this.nextFrame();
      }
      // console.log(i);
   };
}