import type { IGameEvents, TGameEvent } from "../Events/IEvents";
import type { IE2eTest } from "./IE2eTest";
import type { TInitParams } from "../IService";

import { BrowserDriver, IsBrowser } from "../../../drivers/BrowserDriver";
import { history } from "./history";

type TConstructor = {
   name: string
}

export class E2eTest implements IE2eTest {
   public readonly name: string;
   /**
    * Keep track of which frame it is "locally" in this object.
    * the current frame comes with the "frame_tick" event.
    * Since we want as few dependencies as possible we want to ONLY be dependent on the Events
    * service and NOT also have to grab FrameCount off the GameLoop service directly.
    */
   private frameCount = 0;
   private history: Partial<{ [frame: number]: TGameEvent[] }> = {};
   private startTime = BrowserDriver.PerformanceNow();

   // deps/services
   private events!: IGameEvents;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      // TODO: Replace typecast with type guard.
      this.events = deps?.events as IGameEvents;

      // TODO: These are not unsubscribed to.
      this.events.subscribeToEvent(this.name, this.onEvent);
   };

   private onEvent = (event: TGameEvent) => {
      if (event.type === "player_died") {
         // This should actually trigger for very kind of END OF GAME scenario.
         console.log("E2eTest: Test succeeded.");
         const seconds = (BrowserDriver.PerformanceNow() - this.startTime)/1000;
         console.log(`E2eTest: Took ${seconds} seconds to run test.`);
         if (!IsBrowser()) {
            // eslint-disable-next-line no-undef
            process.exit(0);
         }
      }
      if (event.type !== "frame_tick") {
         // dont record frame_tick because that's excessive.
         const frame = this.frameCount;
         if (this.history[frame] === undefined) {
            this.history[frame] = [];
         }
         this.history[frame]?.push(event); // record event in history/
      }
      if (event.type === "frame_tick") {
         // Crucial that we keep track of the current frame!!
         this.frameCount = event.frameNr;

         const lastFrame = event.frameNr - 1;
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         //@ts-ignore
         const expected = JSON.stringify(history[lastFrame] as TGameEvent[] | undefined);
         const actual = JSON.stringify(this.history[lastFrame]);
         if (expected !== actual) {
            BrowserDriver.Alert(
               `Test failed!\nFrame: ${lastFrame}\nExpected: ${expected}\nActual: ${actual}`
            );
         }
      }
   };
}