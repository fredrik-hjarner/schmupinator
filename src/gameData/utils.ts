import type {
   TAction, TAttrIs, TDo, TFork, TMoveToAbsolute, TNumber, TRepeat, TSetShotSpeed, TSetSpeed,
   TSpawn, TWait, TparallelAll, TparallelRace
} from "../App/services/Enemies/actions/actionTypes";
import type { TGameObject } from "@/gameTypes/TGameObject";

import { ActionType as AT } from "../App/services/Enemies/actions/actionTypes";

type TCreateGameObjectParams = {
   name: string;
   hp: number; // TODO: | "invincible"
   diameter: number;
   actions: TAction[];
   /**
   * One action that is executed immediately when an enemy reaches 0 hp.
   * MUST take at most 1 frame to execute.
   * The reason for this is that the enemy has died and is
   * being removed from the system. If you need to do more than 1 action then you may spawn a
   * new GameObject and have those actions in that GameObject, I call this concept
   * "spawning a corpse".
   */
   onDeathAction?: TAction | undefined;
   /**
    * Some options.
    * TODO: Move these up to root level and make them mandatory to set. It is convenient to have
    * them optional, for now, but it is also easy to forget to set them.
    * */
   options?: {
      /** If true then the GameObject will be removed when it moves outside the screen. */
      despawnWhenOutsideScreen?: boolean;
      /** Set to true disable polling hp every frame for death. */
      invincible?: boolean;
   }
}
/**
 * A function I made as a middle layer to make so I would need to make fewer changes to gameObjects
 * when adding the functionality for a player to have several lives.
 * What I need is to remove the onDeathActions internally in the code and manage that manually
 * with actions (and attriubutes).
 * TODO: Maybe this should be removed when it is no longer needed??
 */
export function createGameObject(params: TCreateGameObjectParams): TGameObject {
   const despawnWhenOutsideScreen = params.options?.despawnWhenOutsideScreen ?? true;
   const invincible = params.options?.invincible ?? false;

   const despawnWhenOutsideScreenAction: TAction[] = despawnWhenOutsideScreen ? [{
      type: AT.fork,
      actions: [
         { type: AT.waitTilInsideScreen }, // TODO: This should take a margin argument.
         { type: AT.waitTilOutsideScreen }, // TODO: This should take a margin argument.
         { type: AT.despawn }
      ]
   }] : [];

   const invincibleAction: TAction[] = invincible ? [] : [fork(
      /**
       * TODO: since hp always exists on atributes I should prolly add it to type
       * so I get auto-completion
       */
      { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
      ...(params.onDeathAction ? [params.onDeathAction] : []),
      { type: AT.despawn },
   )];

   return {
      name: params.name,
      diameter: params.diameter,
      actions: [
         // Set some default attributes.
         { type: AT.setAttribute, attribute: "points", value: 10 },
         { type: AT.setAttribute, attribute: "pointsOnDeath", value: 0 },
         { type: AT.setAttribute, attribute: "collisionType", value: "enemy" },
         { type: AT.setAttribute, attribute: "boundToWindow", value: false },
         { type: AT.setAttribute, attribute: "hp", value: params.hp },
         { type: AT.setAttribute, attribute: "maxHp", value: params.hp },
         // Setup despawning when GameObject moves out of the screen.
         ...despawnWhenOutsideScreenAction,
         // Die when hp is 0. TODO: Actually it should be LTE to 0.
         ...invincibleAction,
         // "Normal" actions
         ...params.actions
      ]
   };
}

type TAttrParams = {
   is: TAttrIs["is"];
   yes?: TAttrIs["yes"];
   no?: TAttrIs["no"];
};
export function attr(attrName: TAttrIs["attrName"], { is, yes, no }: TAttrParams): TAttrIs {
   return {
      type: AT.attrIs,
      attrName,
      is,
      yes,
      no
   };
}

// first caps because `do` is a reserved word in js.
export const Do = (...actions: TAction[]): TDo => ({
   type: AT.do,
   acns: actions
});

export const forever = (...actions: TAction[]): TRepeat => ({
   type: AT.repeat,
   times: 100_000_000,
   actions
});

export function fork(...actions: TAction[]): TFork {
   return {
      type: AT.fork,
      actions
   };
}

type TMoveToAbsParams = { x?: number, y?: number, frames: number};
export const moveToAbsolute = ({ x, y, frames }: TMoveToAbsParams): TMoveToAbsolute => ({
   type: AT.moveToAbsolute,
   moveTo: { x, y },
   frames
});

export const parallelAll = (...actions: (TAction|TAction[])[]): TparallelAll => ({
   type: AT.parallelAll,
   actionsLists: actions.map(acns => Array.isArray(acns) ? acns : [acns])
});

export function parallelRace(...actions: (TAction|TAction[])[]): TparallelRace {
   return {
      type: AT.parallelRace,
      actionsLists: actions.map(acn => Array.isArray(acn) ? acn : [acn])
   };
}

export const repeat = (times: TNumber, actions: TAction[]): TRepeat => ({
   type: AT.repeat,
   times,
   actions
});

export const setSpeed = (pixelsPerFrame: number): TSetSpeed => ({
   type: AT.setSpeed,
   pixelsPerFrame
});

type TSpawnParams = {
   x?: number;
   y?: number;
   actions?: (TAction)[]
}
export const spawn = (enemy: string, params?: TSpawnParams): TSpawn => ({
   type: AT.spawn,
   enemy,
   x: params?.x,
   y: params?.y,
   actions: params?.actions
});

export const setShotSpeed = (pixelsPerFrame: number): TSetShotSpeed => ({
   type: AT.setShotSpeed,
   pixelsPerFrame
});

export const thrice = (...actions: TAction[]): TRepeat => repeat(3, actions);

export const twice = (...actions: TAction[]): TRepeat => repeat(2, actions);

export const wait = (frames: TNumber): TWait => ({ type: AT.wait, frames });
