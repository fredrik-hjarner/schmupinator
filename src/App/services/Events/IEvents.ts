import type { App } from "../../App";
import type { TCollisions } from "../Collisions/Collisions";
import type { IService } from "../IService";

/***********
 * Generic *
 ***********/

export type TEventCallback<TEvent> = (event: TEvent) => void;

export type TEventSubscribers<TEvent> = {
   [ key: string]: TEventCallback<TEvent>
}

export interface IEvents<TEvent> extends IService {
   app: App;
   name: string;
   subscribeToEvent: (nameOfSubscriber: string, callback: TEventCallback<TEvent>) => void
   unsubscribeToEvent: (nameOfSubscriber: string) => void
   dispatchEvent: (event: TEvent) => void
}

/**************
 * GameEvents *
 **************/

type TEventFrameTick = { type: "frame_tick", frameNr: number };
type TEventCollisions = { type: "collisions", collisions: TCollisions };

export type TGameEvent =
   TEventFrameTick | // signals next frame has come.
   TEventCollisions | // when collisions happen.
   { type: "player_died" }; // when player dies.

export type TGameEventCallback =  TEventCallback<TGameEvent>;
export type TGameEventSubscribers = TEventSubscribers<TGameEvent>
export type IGameEvents = IEvents<TGameEvent>;


/**************
 * UiEvents *
 **************/

export type TUiEvent =
   // sent for/to UI so UI can update.
   { type: "uiScoreUpdated", points: number };

export type TUiEventCallback =  TEventCallback<TUiEvent>;
export type TUiEventSubscribers = TEventSubscribers<TUiEvent>
export type IUiEvents = IEvents<TUiEvent>;

/****************
 * EventsPoints *
 ****************/

export type TPointsEvent =
   // add points to the player (could be negative).
   { type: "add_points", points: number, enemy: string };

export type TPointsEventCallback =  TEventCallback<TPointsEvent>;
export type TPointsEventSubscribers = TEventSubscribers<TPointsEvent>;
export type IEventsPoints = IEvents<TPointsEvent>;