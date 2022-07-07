import type { App } from "../../App";
import type { TCollisions } from "../Collisions/Collisions";
import type { IService } from "../IService";

export type TCallback = (event: TEvent) => void;

export type TSubscribers = {
   [ key: string]: TCallback
}

type TEventFrameTick = { type: "frame_tick" };
type TEventCollisions = { type: "collisions", collisions: TCollisions };

export type TEvent =
   TEventFrameTick | // signals next frame has come.
   TEventCollisions | // when collisions happen.
   { type: "player_missed_bullet" } | // when player's bullet exists gameDiv/screen.
   { type: "player_died" } | // when player dies.
   // add points to the player (could be negative).
   { type: "add_points", points: number, enemy: string } |
   // sent for/to UI so UI can update.
   { type: "uiScoreUpdated", points: number };

export interface IEvents extends IService {
   app: App;
   name: string;
   subscribeToEvent: (nameOfSubscriber: string, callback: TCallback) => void
   unsubscribeToEvent: (nameOfSubscriber: string) => void
   dispatchEvent: (event: TEvent) => void
}