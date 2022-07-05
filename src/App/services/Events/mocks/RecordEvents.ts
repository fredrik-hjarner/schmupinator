import type { App } from "../../../App";
import type { IEvents, TCallback, TEvent, TSubscribers } from "../IEvents";

import { IsBrowser } from "../../../../drivers/BrowserDriver";

type TConstructor = {
   app: App,
   name: string
}

export class RecordEvents implements IEvents {
   app: App;
   name: string;
   subscribers: TSubscribers;
   history: Partial<{ [frame: number]: TEvent[] }>;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.history = {};
      this.subscribers = {}; // key-callback pairs
   }

   Init = async () => {
      // noop
   };

   public subscribeToEvent = (nameOfSubscriber: string, callback: TCallback) => {
      this.subscribers[nameOfSubscriber] = callback;
   };

   public unsubscribeToEvent = (nameOfSubscriber: string) => {
      delete this.subscribers[nameOfSubscriber];
   };

   public dispatchEvent = (event: TEvent) => {
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