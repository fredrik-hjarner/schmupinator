import type  { App } from "../../App";
import type { IFps } from "./IFps";
import type { TGameEvent } from "../Events/IEvents";

import { round } from "../../../utils/round";
import { initElapsedTimeDiv } from "./elapsedTimeDiv";
import { initFpsDiv } from "./fpsDiv";
import { initFrameCounterDiv } from "./frameCounterDiv";
import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { isHTMLDivElement } from "../../../utils/typeAssertions";

type TConstructor = {
   app: App;
   name: string;
};

export class Fps implements IFps {
   public app: App;
   public name: string;
   private startTime: number | null;

   //elements
   readonly framCounterDiv: unknown;
   readonly elapsedTimeDiv: unknown;
   readonly fpsDiv: unknown;

   /**
    * Public
    */
   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.framCounterDiv = initFrameCounterDiv();
      this.elapsedTimeDiv = initElapsedTimeDiv();
      this.fpsDiv = initFpsDiv();
      this.startTime = null;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   Init = async () => {
      // TODO: Never unsubscribes to this !!!
      this.app.events.subscribeToEvent(this.name, this.handleEvent);
   };

   /**
    * Private
    */
   private handleEvent = (event: TGameEvent) => {
      if(event.type !== "frame_tick") {
         return;
      }

      if(this.startTime === null) {
         this.startTime = BrowserDriver.PerformanceNow();
      }
      
      // Display stats.
      const elapsed = BrowserDriver.PerformanceNow() - this.startTime;
      if(
         isHTMLDivElement(this.elapsedTimeDiv) &&
         isHTMLDivElement(this.framCounterDiv) &&
         isHTMLDivElement(this.fpsDiv)
      ) {
         const frame = this.app.gameLoop.FrameCount;
         this.elapsedTimeDiv.innerHTML = `elapsed: ${round(elapsed/1000)}s`;
         this.framCounterDiv.innerHTML = `frames: ${frame}`;
         this.fpsDiv.innerHTML = `fps: ${Math.round(frame / (elapsed / 1000))}`;
      }
   };
}