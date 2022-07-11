import type { App } from "../../../App";
import type {
   IGameEvents, TGameEventCallback, TGameEvent, TGameEventSubscribers
} from "../IEvents";

import { IsBrowser } from "../../../../drivers/BrowserDriver";

type TConstructor = {
   app: App,
   name: string
}

export class RecordGameEvents implements IGameEvents {
   public readonly app: App;
   public readonly name: string;
   private subscribers: TGameEventSubscribers;
   private history: Partial<{ [frame: number]: TGameEvent[] }>;

   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.history = {};
      this.subscribers = {}; // key-callback pairs
   }

   public Init = async () => {
      // noop
   };

   public subscribeToEvent = (nameOfSubscriber: string, callback: TGameEventCallback) => {
      this.subscribers[nameOfSubscriber] = callback;
   };

   public unsubscribeToEvent = (nameOfSubscriber: string) => {
      delete this.subscribers[nameOfSubscriber];
   };

   public dispatchEvent = (event: TGameEvent) => {
      if(event.type === "player_died") {
         if(IsBrowser()) {
            console.log("RecordEvents.history:");
            console.log(this.history);
         }
      }
      if(event.type !== "frame_tick") {
         // dont record frame_tick because that's excessive.
         const frame = this.app.gameLoop.FrameCount;
         if(this.history[frame] === undefined) {
            this.history[frame] = [];
         }
         this.history[frame]?.push(event); // record event in history/
      }
      Object.values(this.subscribers).forEach(callback => {
         callback(event);
      });
   };
}