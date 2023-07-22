import type {
   IEventsCollisions, IEventsPoints, IGameEvents, TCollisionsEvent, TGameEvent, TPointsEvent
} from "../../Events/IEvents";
import type { IE2eTest } from "../IE2eTest";
import type { TInitParams } from "../../IService";

type THistory = Partial<{ [frame: number]: (TGameEvent | TPointsEvent | TCollisionsEvent)[] }>;

type TConstructor = {
   name: string
}

export class E2eRecordEvents implements IE2eTest {
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

   // deps/services
   private events!: IGameEvents;
   private eventsCollisions!: IEventsCollisions;
   private eventsPoints!: IEventsPoints;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      // TODO: Replace typecast with type guard.
      /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
      this.events = deps?.events!;
      this.eventsCollisions = deps?.eventsCollisions!;
      this.eventsPoints = deps?.eventsPoints!;
      /* eslint-enable @typescript-eslint/no-non-null-asserted-optional-chain */

      // TODO: These are not unsubscribed to.
      this.events.subscribeToEvent(this.name, this.onEvent);
      this.eventsCollisions.subscribeToEvent(this.name, this.onEvent);
      this.eventsPoints.subscribeToEvent(this.name, this.onEvent);
   };

   private onEvent = (event: TGameEvent | TPointsEvent | TCollisionsEvent) => {
      if (event.type === "gameOver") {
         console.log("E2eRecordEvents.history:");
         console.log(this.history);
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
      }
   };
}