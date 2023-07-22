import type {
   TAction, TAttrIs, TDo, TFork, TMoveToAbsolute, TNumber, TRepeat, TSetShotSpeed, TSetSpeed,
   TSpawn, TWait, TparallelAll, TparallelRace
} from "../App/services/Enemies/actions/actionTypes";
import type { IEnemyJson } from "@/gameTypes/IEnemyJson";

import { ActionType as AT } from "../App/services/Enemies/actions/actionTypes";

type TCreateGameObjectParams = {
   name: string;
   hp: number;
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
}
/**
 * A function I made as a middle layer to make so I would need to make fewer changes to gameObjects
 * when adding the functionality for a player to have several lives.
 * What I need is to remove the onDeathActions internally in the code and manage that manually
 * with actions (and attriubutes).
 * TODO: Maybe this should be removed when it is no longer needed??
 */
export function createGameObject(params: TCreateGameObjectParams): IEnemyJson {
   return {
      name: params.name,
      hp: params.hp,
      diameter: params.diameter,
      actions: [
         fork(
            /**
             * TODO: since hp always exists on atributes I should prolly add it to type
             * so I get auto-completion
             */
            // Die when hp is 0. TODO: Actually it should be LTE to 0.
            { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
            ...(params.onDeathAction ? [params.onDeathAction] : []),
            { type: AT.despawn },
         ),
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
