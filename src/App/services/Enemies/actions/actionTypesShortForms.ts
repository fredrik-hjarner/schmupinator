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
   }
   return shortForm;
};

export function isShortFormAction(action: TAction|TShortFormAction): boolean {
   return iShortFormAttr(action) ||
         isShortFormSetShotSpeed(action) ||
         isShortFormMoveToAbsolute(action);
}

export type TShortFormAction =
   Exclude<
      TAction,
      TWait | TSpawn | TRepeat | TAttr | TSetShotSpeed | TMoveToAbsolute | TSetSpeed |
      { type: "parallelAll" } | { type: "parallelRace" } | TFork
   > |

   TShortFormAttr |
   TShortFormSetShotSpeed |
   TShortFormMoveToAbsolute;
