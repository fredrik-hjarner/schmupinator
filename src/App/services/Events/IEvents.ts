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

export type TGameEvent =
   TEventFrameTick | // signals next frame has come.
   { type: "gameOver" }; // when player dies.

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

/********************
 * EventsCollisions *
 ********************/

export type TCollisionsEvent =
   // when collisions happen.
   { type: "collisions", collisions: TCollisions };

export type TCollisionsEventCallback =  TEventCallback<TCollisionsEvent>;
export type TCollisionsEventSubscribers = TEventSubscribers<TCollisionsEvent>;
export type IEventsCollisions = IEvents<TCollisionsEvent>;

/**************
 * EndOfFrame *
 **************/

/**
 * Happens at precisely before the end of frame. Services may "commit" their work or whatever.
 * I mostly did this for the Graphics service that accumulates changes then commits them in the end
 * in one go (i.e. dont change single style fields rather batch them up and do all-at-once).
 */
export type TEndOfFrameEvent = { type: "end_of_frame", frameNr: number };

export type TEndOfFrameEventCallback =  TEventCallback<TEndOfFrameEvent>;
export type TEndOfFrameEventtSubscribers = TEventSubscribers<TEndOfFrameEvent>
export type IEventsEndOfFrame = IEvents<TEndOfFrameEvent>;