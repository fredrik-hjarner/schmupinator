import type {
   IEventsCollisions, IEventsPoints, IGameEvents, TCollisionsEvent, TGameEvent, TPointsEvent
} from "../Events/IEvents";
import type { IE2eTest } from "./IE2eTest";
import type { TInitParams } from "../IService";
import type { Collisions } from "../Collisions/Collisions";

import { BrowserDriver, IsBrowser } from "../../../drivers/BrowserDriver";

type THistory = Partial<{ [frame: number]: (TGameEvent | TPointsEvent | TCollisionsEvent)[] }>;

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
   // local history (what actually happened)
   private history: THistory = {};
   // From file that has been pre-recorded.
   private recordedHistory!: THistory;
   private startTime = BrowserDriver.PerformanceNow();

   // deps/services
   private collisions!: Collisions;
   private events!: IGameEvents;
   private eventsCollisions!: IEventsCollisions;
   private eventsPoints!: IEventsPoints;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      this.recordedHistory = (await import("./e2ehistory")).recordedHistory as THistory;

      // TODO: Replace typecast with type guard.
      this.collisions = deps?.collisions as Collisions;
      this.events = deps?.events as IGameEvents;
      this.eventsCollisions = deps?.eventsCollisions as IEventsCollisions;
      this.eventsPoints = deps?.eventsPoints as IEventsPoints;

      // TODO: These are not unsubscribed to.
      this.events.subscribeToEvent(this.name, this.onEvent);
      this.eventsCollisions.subscribeToEvent(this.name, this.onEvent);
      this.eventsPoints.subscribeToEvent(this.name, this.onEvent);
   };

   private onEvent = (event: TGameEvent | TPointsEvent | TCollisionsEvent) => {
      if (event.type === "player_died") {
         // This should actually trigger for very kind of END OF GAME scenario.
         console.log("E2eTest: Test succeeded.");
         const seconds = (BrowserDriver.PerformanceNow() - this.startTime)/1000;
         console.log(`E2eTest: Took ${seconds} seconds to run test.`);
         console.log(`E2eTest: Collision detection took ${this.collisions.accumulatedTime} ms.`);
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
         //@ts-ignore
         const expected = JSON.stringify(
            this.recordedHistory[lastFrame] as (TGameEvent | TPointsEvent)[] | undefined
         );
         const actual = JSON.stringify(this.history[lastFrame]);
         if (expected !== actual) {
            BrowserDriver.Alert(
               `Test failed!\nFrame: ${lastFrame}\nExpected: ${expected}\nActual: ${actual}`
            );
         }
      }
   };
}