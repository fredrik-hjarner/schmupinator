import type  { App } from "../../App";

import { millisPerFrame } from "../../../consts";
import { IGameLoop } from "./IGameLoop";
import { BrowserDriver } from "../../../drivers/BrowserDriver";

type TConstructor = {
   app: App;
   name: string;
};

export class GameLoop implements IGameLoop {
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
      BrowserDriver.SetInterval(this.oneGameLoop, 0);
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
      const gameSpeed = this.app.gameSpeed.GameSpeed;
      for(let i=0; i<gameSpeed; i++) {
         this.nextFrame();
      }
   };

   /**
   * This may not actually progress the game one frame.
   * Idea is to run these as fast as possible and to only progress a frame
   * when one frame has passed.
   */
   private oneGameLoop = () => {
      /**
       * This outer for loop is only because setInterval is so slow,
       * it might actually be slower than 60 setInterval per second.
       * It might not be necessary, and 3 is just an arbitrary number.
       */
      // for(let i=0; i<3; i++) {
      if(this.nextFrameMillis === null) {
         BrowserDriver.Alert("this.nextFrameMillis === null");
         throw new Error("this.nextFrameMillis === null");
      }
      while (BrowserDriver.PerformanceNow() >= this.nextFrameMillis) {
         this.nextFrameMillis += millisPerFrame;
         this.advanceFrames();
      }
      // }
   };
}