import type { App } from "../../App";
import type { IEvents, TCallback, TEvent, TSubscribers } from "./IEvents";

type TConstructor = {
   app: App,
   name: string
}

export class Events implements IEvents {
   app: App;
   name: string;
   private subscribers: TSubscribers;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
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
      Object.values(this.subscribers).forEach(callback => {
         callback(event);
      });
   };
}