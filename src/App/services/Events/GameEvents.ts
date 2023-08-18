import type { App } from "../../App";

type TEventFrameTick = { type: "frame_tick", frameNr: number };

export type TGameEvent =
   TEventFrameTick | // signals next frame has come.
   { type: "gameOver" }; // when player dies.

type TEventCallback = (event: TGameEvent) => Promise<void>;

type TEventSubscribers = {
   [ key: string]: TEventCallback
}

type TConstructor = {
   app: App,
   name: string
}

export class GameEvents {
   public readonly app: App;
   public readonly name: string;
   private subscribers: TEventSubscribers;

   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.subscribers = {}; // key-callback pairs
   }

   public Init = async () => {
      // noop
   };

   public subscribeToEvent = (
      nameOfSubscriber: string,
      callback: TEventCallback
   ) => {
      // TODO: I should have warning come up if trying to sub when already subbed.
      this.subscribers[nameOfSubscriber] = callback;
   };

   public unsubscribeToEvent = (nameOfSubscriber: string) => {
      // TODO: I should have warning come up if trying to unsub when not subbed.
      delete this.subscribers[nameOfSubscriber];
   };

   public dispatchEvent = async (event: TGameEvent) => {
      for (const callback of Object.values(this.subscribers)) {
         await callback(event);
      }
   };
}