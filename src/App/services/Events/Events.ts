import type { App } from "../../App";
import type { TCollisions } from "../Collisions/Collisions";
import type { IService } from "../IService";

type TConstructor = {
   app: App,
   name: string
}

type TCallback = (event: TEvent) => void;

type TSubscribers = {
   [ key: string]: TCallback
}

type TEventFrameTick = { type: "frame_tick" };
type TEventCollisions = { type: "collisions", collisions: TCollisions };

export type TEvent =
   TEventFrameTick | // signals next frame has come.
   TEventCollisions | // when collisions happen.
   { type: "player_missed_bullet" } | // when player's bullet exists gameDiv/screen.
   { type: "player_died" } | // when player dies.
   { type: "add_points", points: number }; // add points to the player (could be negative).

export class Events implements IService {
   app: App;
   name: string;
   subscribers: TSubscribers;

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