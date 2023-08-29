import type  { App } from "../../../App";
import type { IGameLoop } from "../IGameLoop";

import { round } from "@/utils/round.ts";
import { millisPerFrame } from "../../../../consts.ts";
import { BrowserDriver } from "../../../../drivers/BrowserDriver/index.ts";

/**
 * The idea is to log performance data.
 */
type TLog = {
   frameNr: number;
   beforeTime: number;
   time: number;
   afterTime: number;
}[];

type TConstructor = {
   app: App;
   name: string;
};

export class ReqAnimFrameGameLoop implements IGameLoop {
   // vars
   public name: string;
   public FrameCount: number; // TODO: Make private.
   public frameSpeedMultiplier: number; // 1 = normal spd. 0 = paused. 2 = twice spd etc.
   private firstFrameTime?: number;
   private log: TLog = [];

   // deps/services
   public app: App;

   /**
   * Public
   */
   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.FrameCount = 0;
      // TODO: Questionable if this should start as 1, but that's how it was.
      this.frameSpeedMultiplier = 1;
   }

   public Init = async () => {
      // noop
   };

   public Start = () => {
      BrowserDriver.RequestAnimationFrame(this.oneGameLoop);
   };

   public pause = () => {
      this.frameSpeedMultiplier = 0;
   };

   // Public because GameSpeed might want control over frames.
   public nextFrame = () => {
      this.FrameCount++;
      const before = BrowserDriver.PerformanceNow();
      this.app.events.dispatchEvent({ type: "frame_tick", frameNr: this.FrameCount });
      this.app.eventsEndOfFrame.dispatchEvent({
         type: "end_of_frame",
         frameNr: this.FrameCount
      });
      const after = BrowserDriver.PerformanceNow();
      this.log.push({
         frameNr: this.FrameCount,
         beforeTime: before,
         afterTime: after,
         time: after-before,
      });
   };

   /**
   * Private
   */
   private advanceFrames = () => {
      for(let i=0; i<this.frameSpeedMultiplier; i++) {
         this.nextFrame();
      }
   };

   /**
   * This may not actually progress the game one frame.
   * Idea is to run these as fast as possible and to only progress a frame
   * when one frame has passed.
   */
   private oneGameLoop = () => {
      BrowserDriver.RequestAnimationFrame(this.oneGameLoop);
      if (!this.firstFrameTime) {
         this.firstFrameTime = BrowserDriver.PerformanceNow();
      }

      const expectedFrameCount =
         Math.round((BrowserDriver.PerformanceNow() - this.firstFrameTime) / millisPerFrame);
      // if (expectedFrameCount !== this.FrameCount) {
      // console.info(`Frame #${this.FrameCount}: frameDiff:`, expectedFrameCount-this.FrameCount);
      // }

      /**
       * Max 2 frames per requestAnimationFrame. No screen can have less than 30hz refresh frequency
       */
      if (expectedFrameCount >= this.FrameCount) {
         this.advanceFrames();
      }
      if (expectedFrameCount >= this.FrameCount) {
         this.advanceFrames();
      }

      /**
       * This if case is just for debugging performance.
       * It shows how many frames took how many milliseconds.
       */
      if (this.FrameCount > 60 * 30) {
         const buckets: Record<number, number> = {};
         for (const log of this.log) {
            const bucket = Math.round(log.time);
            buckets[bucket] = (buckets[bucket] || 0) + 1;
         }
         const percentages: Record<number, string> = {};
         for (const bucket in buckets) {
            percentages[bucket] = `${round(100 * buckets[bucket] / this.log.length, 1)}%`;
         }
         console.log("percentages:", percentages);
         debugger;
      }
   };
}