import type {
   TAction, TAttr, TMoveToAbsolute, TRepeat, TSetShotSpeed, TSetSpeed, TSpawn, TWait, TFork
} from "./actionTypes";
import type { Vector as TVector } from "../../../../math/bezier";
import type { TAttributeValue } from "../Attributes/Attributes";

export type TShortFormAttr =
   { attr: string, is: TAttributeValue, yes?: TShortFormAction[], no?: TShortFormAction[] };
const iShortFormAttr = (action: (TAction|TShortFormAction)): action is TShortFormAttr => {
   return (action as TShortFormAttr).attr !== undefined;
};

export type TShortFormSetShotSpeed = { setShotSpeed: number };
const isShortFormSetShotSpeed =
   (action: (TAction|TShortFormAction)): action is TShortFormSetShotSpeed => {
      return (action as TShortFormSetShotSpeed).setShotSpeed !== undefined;
   };

export type TShortFormMoveToAbsolute = { moveToAbsolute: Partial<TVector>, frames: number };
const isShortFormMoveToAbsolute =
   (acn: (TAction|TShortFormAction)): acn is TShortFormMoveToAbsolute => {
      return (acn as TShortFormMoveToAbsolute).moveToAbsolute !== undefined;
   };

export type TShortFormSetSpeed = { setSpeed: number };
const isShortFormSetSpeed = (acn: (TAction|TShortFormAction)): acn is TShortFormSetSpeed => {
   return (acn as TShortFormSetSpeed).setSpeed !== undefined;
};

export type TTwice = { twice: TShortFormAction[] };
const isTwice = (acn: (TAction|TShortFormAction)): acn is TTwice => {
   return (acn as TTwice).twice !== undefined;
};

export type TThrice = { thrice: TShortFormAction[] };
const isThrice = (acn: (TAction|TShortFormAction)): acn is TThrice => {
   return (acn as TThrice).thrice !== undefined;
};

export type TShortFormFork = { fork: TShortFormAction[] };
const isShortFormFork = (acn: (TAction|TShortFormAction)): acn is TShortFormFork => {
   return (acn as TShortFormFork).fork !== undefined;
};

export const ShortFormToLongForm = (shortForm: TAction|TShortFormAction): TAction => {
   if(iShortFormAttr(shortForm)) {
      const { attr, is, yes, no } = shortForm;
      return { type: "attr", attrName: attr, is, yes, no };
   } else if(isShortFormSetShotSpeed(shortForm)) {
      const { setShotSpeed } = shortForm;
      return { type: "setShotSpeed", pixelsPerFrame: setShotSpeed };
   }else if(isShortFormMoveToAbsolute(shortForm)) {
      const { moveToAbsolute, frames } = shortForm;
      return { type: "moveToAbsolute", moveTo: moveToAbsolute, frames };
   }else if(isShortFormSetSpeed(shortForm)) {
      return { type: "setSpeed", pixelsPerFrame: shortForm.setSpeed };
   }else if(isTwice(shortForm)) {
      return { type: "repeat", times: 2, actions: shortForm.twice };
   }else if(isThrice(shortForm)) {
      return { type: "repeat", times: 3, actions: shortForm.thrice };
   } else if(isShortFormFork(shortForm)) {
      return { type: "fork", actions: shortForm.fork };
   }
   return shortForm;
};

export function isShortFormAction(action: TAction|TShortFormAction): boolean {
   return iShortFormAttr(action) ||
         isShortFormSetShotSpeed(action) ||
         isShortFormMoveToAbsolute(action) ||
         isShortFormSetSpeed(action) ||
         isTwice(action) ||
         isThrice(action) ||
         isShortFormFork(action);
}

export type TShortFormAction =
   Exclude<
      TAction,
      TWait | TSpawn | TRepeat | TAttr | TSetShotSpeed | TMoveToAbsolute | TSetSpeed |
      { type: "parallelAll" } | { type: "parallelRace" } | TFork
   > |

   TShortFormAttr |
   TShortFormSetShotSpeed |
   TShortFormMoveToAbsolute |
   TShortFormSetSpeed |
   TTwice |
   TThrice |
   TShortFormFork
