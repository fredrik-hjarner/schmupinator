import type  { App } from "../../App";
import type { IFps } from "./IFps";
import type { TGameEvent } from "../Events/IEvents";

import { round } from "../../../utils/round";
import { initElapsedTimeDiv } from "./elapsedTimeDiv";
import { initFpsDiv } from "./fpsDiv";
import { initFrameCounterDiv } from "./frameCounterDiv";
import { BrowserDriver } from "../../../drivers/BrowserDriver";

type TConstructor = {
   app: App;
   name: string;
};

export class Fps implements IFps {
   public app: App;
   public name: string;
   private startTime: number | null;

   //elements
   private readonly framCounterDiv: HTMLDivElement;
   private readonly elapsedTimeDiv: HTMLDivElement;
   private readonly fpsDiv: HTMLDivElement;

   /**
    * Public
    */
   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.framCounterDiv = initFrameCounterDiv() as HTMLDivElement;
      this.elapsedTimeDiv = initElapsedTimeDiv() as HTMLDivElement;
      this.fpsDiv = initFpsDiv() as HTMLDivElement;
      this.startTime = null;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async () => {
      // TODO: Never unsubscribes to this !!!
      this.app.events.subscribeToEvent(this.name, this.handleEvent);

      // TODO: remove duplication. Have common/duped code in common function.
      this.elapsedTimeDiv.innerHTML = `elapsed: 0s`;
      this.framCounterDiv.innerHTML = `frames: 0`;
      this.fpsDiv.innerHTML = `fps: 0`;
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

      const frame = event.frameNr;
      this.elapsedTimeDiv.innerHTML = `elapsed: ${round(elapsed/1000)}s`;
      this.framCounterDiv.innerHTML = `frames: ${frame}`;
      this.fpsDiv.innerHTML = `fps: ${Math.round(frame / (elapsed / 1000))}`;
   };
}