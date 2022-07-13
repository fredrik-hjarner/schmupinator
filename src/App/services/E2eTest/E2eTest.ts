import type { IGameEvents, TGameEvent } from "../Events/IEvents";
import type { IE2eTest } from "./IE2eTest";
import type { TInitParams } from "../IService";

import { BrowserDriver } from "../../../drivers/BrowserDriver";
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
   private frameCount: number = 0;
   private history: Partial<{ [frame: number]: TGameEvent[] }> = {};

   // deps/services
   private events!: IGameEvents;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   public Init = async (deps?: TInitParams) => {
      // TODO: Replace typecast with type guard.
      this.events = deps?.events as IGameEvents;

      // TODO: These are not unsubscribed to.
      this.events.subscribeToEvent(this.name, this.onEvent);
   };

   private onEvent = (event: TGameEvent) => {
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