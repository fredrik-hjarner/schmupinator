import type { TAction, TRepeat, TSpawn, TWait } from "./actionTypes";

export type TShortFormWait = { wait: number };
const isShortFormWait = (action: TShortFormAction): action is TShortFormWait => {
   return (action as TShortFormWait).wait !== undefined;
};

export type TShortFormSpawn = { spawn: string, x: number, y: number };
const isShortFormSpawn = (action: TShortFormAction): action is TShortFormSpawn => {
   return (action as TShortFormSpawn).spawn !== undefined;
};

export type TShortFormRepeat = { repeat: number, actions: TShortFormAction[] };
const isShortFormRepeat = (action: TShortFormAction): action is TShortFormRepeat => {
   return (action as TShortFormRepeat).repeat !== undefined;
};


export const ShortFormToLongForm = (shortForm: TShortFormAction): TAction => {
   if(isShortFormWait(shortForm)) {
      const { wait } = shortForm;
      return { type: "wait", frames: wait };
   } else if(isShortFormSpawn(shortForm)) {
      const { spawn, x, y } = shortForm;
      return { type: "spawn", enemy: spawn, x, y };
   } else if(isShortFormRepeat(shortForm)) {
      const { repeat, actions } = shortForm;
      return { type: "repeat", times: repeat, actions };
   }
   return shortForm;
};

export type TShortFormAction = Exclude<TAction, TWait | TSpawn | TRepeat> |
   TShortFormWait |
   TShortFormSpawn |
   TShortFormRepeat;
