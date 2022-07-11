import type { App } from "../../App";
import type { IEvents, TEventCallback, TEventSubscribers } from "./IEvents";

type TConstructor = {
   app: App,
   name: string
}

export class Events<TEvent> implements IEvents<TEvent> {
   public readonly app: App;
   public readonly name: string;
   private subscribers: TEventSubscribers<TEvent>;

   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.subscribers = {}; // key-callback pairs
   }

   public Init = async () => {
      // noop
   };

   public subscribeToEvent = (nameOfSubscriber: string, callback: TEventCallback<TEvent>) => {
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