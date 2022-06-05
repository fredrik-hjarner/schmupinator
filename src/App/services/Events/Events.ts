import type { App } from "../../App";
import type { TCollisions } from "../Collisions/Collisions";

type TConstructor = {
  app: App,
  name: string
}

type TCallback = (event: TEvent) => void;

type TSubscribers = {
  [key: string]: TCallback
}

type TEvent =
  { type: 'frame_tick' } | // signals next frame has come.
  { type: 'collisions', collisions: TCollisions }; // when collisions happen.

export class Events {
   app: App;
   name: string;
   subscribers: TSubscribers;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.subscribers = {}; // key-callback pairs
   }

   public subscribeToEvent = (nameOfSubscriber: string, callback: TCallback) => {
      this.subscribers[nameOfSubscriber] = callback;
   };

   public unsubscribeToEvent = (nameOfSubscriber: string) => {
      delete this.subscribers[nameOfSubscriber];
   };

   public dispatchEvent = (event: TEvent) => {
      Object.values(this.subscribers).forEach(callback => {
         callback(event);
      });
   };
}