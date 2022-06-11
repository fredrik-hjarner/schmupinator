import type  { App } from "../../App";

import { millisPerFrame } from "../../../consts";
import { round } from "../../../utils/round";
import { initElapsedTimeDiv } from "./elapsedTimeDiv";
import { initFpsDiv } from "./fpsDiv";
import { initFrameCounterDiv } from "./frameCounterDiv";
import { initGameDiv, initGameHideBottom, initGameHideRight } from "./gameDiv";
import { px } from "../../../utils/px";

export class GameLoop {
   readonly app: App;
   FrameCount: number;
   readonly gameDiv: HTMLDivElement;
   readonly framCounterDiv: HTMLDivElement;
   readonly elapsedTimeDiv: HTMLDivElement;
   readonly fpsDiv: HTMLDivElement;
   nextFrameMillis: number | null;
   startTime: number | null;

   /**
   * Public
   */
   constructor(app: App) {
      this.app = app;

      this.FrameCount = 0;
      this.framCounterDiv = initFrameCounterDiv();
      this.gameDiv = initGameDiv();
      initGameHideBottom();
      initGameHideRight();
      this.elapsedTimeDiv = initElapsedTimeDiv();
      this.fpsDiv = initFpsDiv();
      this.nextFrameMillis = null;
      this.startTime = null;
   }

   Start = () => {
      this.startTime = performance.now();
      this.nextFrameMillis = performance.now() + millisPerFrame;
      setInterval(this.oneGameLoop, 0);
   };

   /**
   * Private
   */
   private nextFrame = () => {
      if(this.startTime === null) {
         throw new Error("this.startTime === null");
      }
      const gameSpeed = this.app.gameSpeed.GameSpeed;
      for(let i=0; i<gameSpeed; i++) {
         this.FrameCount++;
         this.app.events.dispatchEvent({ type: "frame_tick" });
         const bgPos: number = Math.round(this.FrameCount/2);
         this.gameDiv.style.backgroundPositionY = px(bgPos);
      }
      // Display stats.
      const elapsed = performance.now() - this.startTime;
      this.elapsedTimeDiv.innerHTML = `elapsed: ${round(elapsed/1000)}s`;
      this.framCounterDiv.innerHTML = `frames: ${this.FrameCount}`;
      this.fpsDiv.innerHTML = `fps: ${Math.round(this.FrameCount / (elapsed / 1000))}`;
   };

   /**
   * This may not actually progress the game one frame.
   * Idea is to run these as fast as possible and to only progress a frame
   * when one frame has passed.
   */
   private oneGameLoop = () => {
      if(this.nextFrameMillis === null) {
         throw new Error("this.nextFrameMillis === null");
      }
      while (performance.now() >= this.nextFrameMillis) {
         this.nextFrameMillis += millisPerFrame;
         this.nextFrame();
      }
   };
}