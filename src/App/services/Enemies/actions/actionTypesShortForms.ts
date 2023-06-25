import type {
   TAction, TAttr, TMoveToAbsolute, TRepeat, TSetShotSpeed, TSetSpeed, TSpawn, TWait, TFork
} from "./actionTypes";
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

export const ShortFormToLongForm = (shortForm: TAction|TShortFormAction): TAction => {
   if(iShortFormAttr(shortForm)) {
      const { attr, is, yes, no } = shortForm;
      return { type: "attr", attrName: attr, is, yes, no };
   } else if(isShortFormSetShotSpeed(shortForm)) {
      const { setShotSpeed } = shortForm;
      return { type: "setShotSpeed", pixelsPerFrame: setShotSpeed };
   }
   return shortForm;
};

export function isShortFormAction(action: TAction|TShortFormAction): boolean {
   return iShortFormAttr(action) ||
         isShortFormSetShotSpeed(action);
}

export type TShortFormAction =
   Exclude<
      TAction,
      TWait | TSpawn | TRepeat | TAttr | TSetShotSpeed | TMoveToAbsolute | TSetSpeed |
      { type: "parallelAll" } | { type: "parallelRace" } | TFork
   > |

   TShortFormAttr |
   TShortFormSetShotSpeed;
