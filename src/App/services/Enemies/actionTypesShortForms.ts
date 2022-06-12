import type { TAction } from "./actionTypes";

export type TShortFormWait = { wait: number };

const isShortFormWait = (action: TShortFormAction): action is TShortFormWait => {
   return (action as TShortFormWait).wait !== undefined;
};

export type TShortFormSpawn = { spawn: string, x: number, y: number };

const isShortFormSpawn = (action: TShortFormAction): action is TShortFormSpawn => {
   return (action as TShortFormSpawn).spawn !== undefined;
};

export const ShortFormToLongForm = (shortForm: TShortFormAction): TAction => {
   if(isShortFormWait(shortForm)) {
      const { wait } = shortForm;
      return { type: 'wait', frames: wait };
   } else if(isShortFormSpawn(shortForm)) {
      const { spawn, x, y } = shortForm;
      return { type: 'spawn', enemy: spawn, x, y };
   }
   return shortForm;
};

export type TShortFormAction = TAction |
   TShortFormWait |
   TShortFormSpawn;
