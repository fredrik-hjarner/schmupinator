import type { TAction } from "./actionTypes";

export type TShortFormWait = { wait: number };

const isShortFormWait = (action: TShortFormAction): action is TShortFormWait => {
   return (action as TShortFormWait).wait !== undefined;
};

export const ShortFormToLongForm = (shortForm: TShortFormAction): TAction => {
   if(isShortFormWait(shortForm)) {
      return { type: 'wait', frames: shortForm.wait };
   }
   return shortForm;
};

export type TShortFormAction =
   TAction |
   TShortFormWait;
