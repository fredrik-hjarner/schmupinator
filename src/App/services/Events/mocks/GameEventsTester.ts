import type { App } from "../../../App";
import type {
   IGameEvents, TGameEventCallback, TGameEvent, TGameEventSubscribers
} from "../IEvents";

import { BrowserDriver } from "../../../../drivers/BrowserDriver";
import { history } from "./history";

type TConstructor = {
   app: App,
   name: string
}

export class GameEventsTester implements IGameEvents {
   app: App;
   name: string;
   subscribers: TGameEventSubscribers;
   history: Partial<{ [frame: number]: TGameEvent[] }>;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.history = {};
      this.subscribers = {}; // key-callback pairs
   }

   Init = async () => {
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
         // if(IsBrowser()) {
         //    console.log("RecordEvents.history:");
         //    console.log(this.history);
         // }
      }
      if(event.type !== "frame_tick") {
         // dont record frame_tick because that's excessive.
         const frame = this.app.gameLoop.FrameCount;
         if(this.history[frame] === undefined) {
            this.history[frame] = [];
         }
         this.history[frame]?.push(event); // record event in history/
      }
      if(event.type === "frame_tick") {
         const lastFrame = this.app.gameLoop.FrameCount-1;
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         //@ts-ignore
         const expected = JSON.stringify(history[lastFrame] as TGameEvent[] | undefined);
         const actual = JSON.stringify(this.history[lastFrame]);
         if(expected !== actual) {
            BrowserDriver.Alert(
               `Test failed!\nFrame: ${lastFrame}\nExpected: ${expected}\nActual: ${actual}`
            );
         }
      }
      Object.values(this.subscribers).forEach(callback => {
         callback(event);
      });
   };
}