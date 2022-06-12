import type { TAction, TFlag, TRepeat, TSpawn, TWait } from "./actionTypes";

export type TShortFormWait = { wait: number };
const isShortFormWait = (action: TShortFormAction): action is TShortFormWait => {
   return (action as TShortFormWait).wait !== undefined;
};

export type TShortFormSpawn = { spawn: string, flags?: string[], x: number, y: number };
const isShortFormSpawn = (action: TShortFormAction): action is TShortFormSpawn => {
   return (action as TShortFormSpawn).spawn !== undefined;
};

export type TShortFormRepeat = { repeat: number, actions: TShortFormAction[] };
const isShortFormRepeat = (action: TShortFormAction): action is TShortFormRepeat => {
   return (action as TShortFormRepeat).repeat !== undefined;
};

export type TShortFormParallellAll = { parallellAll: TShortFormAction[][] };
const isShortFormParallellAll = (action: TShortFormAction): action is TShortFormParallellAll => {
   return (action as TShortFormParallellAll).parallellAll !== undefined;
};

export type TShortFormFlag = { flag: string, yes?: TShortFormAction[], no?: TShortFormAction[] };
const iShortFormFlag = (action: TShortFormAction): action is TShortFormFlag => {
   return (action as TShortFormFlag).flag !== undefined;
};

export const ShortFormToLongForm = (shortForm: TShortFormAction): TAction => {
   if(isShortFormWait(shortForm)) {
      const { wait } = shortForm;
      return { type: "wait", frames: wait };
   } else if(isShortFormSpawn(shortForm)) {
      const { spawn, flags, x, y } = shortForm;
      return { type: "spawn", enemy: spawn, flags, x, y };
   } else if(isShortFormRepeat(shortForm)) {
      const { repeat, actions } = shortForm;
      return { type: "repeat", times: repeat, actions };
   } else if(isShortFormParallellAll(shortForm)) {
      const { parallellAll } = shortForm;
      return { type: "parallellAll", actionsLists: parallellAll };
   } else if(iShortFormFlag(shortForm)) {
      const { flag, yes, no } = shortForm;
      return { type: "flag", flagName: flag, yes, no };
   }
   return shortForm;
};

export type TShortFormAction =
   Exclude<TAction, TWait | TSpawn | TRepeat /*| TParallellAll*/ | TFlag> |

   TShortFormWait |
   TShortFormSpawn |
   TShortFormRepeat |
   TShortFormParallellAll |
   TShortFormFlag
