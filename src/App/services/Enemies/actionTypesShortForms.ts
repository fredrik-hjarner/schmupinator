import type {
   TAction, TDo, TAttr, TMoveToAbsolute, TRepeat, TSetShotSpeed, TSetSpeed, TSpawn, TWait, TFork
} from "./actionTypes";
import type { Vector as TVector } from "../../../math/bezier";
import type { TAttributeValue } from "./Attributes/Attributes";

export type TShortFormWait = { wait: number };
const isShortFormWait = (action: TShortFormAction): action is TShortFormWait => {
   return (action as TShortFormWait).wait !== undefined;
};

export type TShortFormSpawn = { 
   spawn: string, x: number, y: number, actions?: TShortFormAction[]
};
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

export type TShortFormParallellRace = { parallellRace: TShortFormAction[][] };
const isShortFormParallellRace = (action: TShortFormAction): action is TShortFormParallellRace => {
   return (action as TShortFormParallellRace).parallellRace !== undefined;
};

export type TShortFormAttr =
   { attr: string, is: TAttributeValue, yes?: TShortFormAction[], no?: TShortFormAction[] };
const iShortFormAttr = (action: TShortFormAction): action is TShortFormAttr => {
   return (action as TShortFormAttr).attr !== undefined;
};

export type TShortFormSetShotSpeed = { setShotSpeed: number };
const isShortFormSetShotSpeed = (action: TShortFormAction): action is TShortFormSetShotSpeed => {
   return (action as TShortFormSetShotSpeed).setShotSpeed !== undefined;
};

export type TShortFormMoveToAbsolute = { moveToAbsolute: Partial<TVector>, frames: number };
const isShortFormMoveToAbsolute = (acn: TShortFormAction): acn is TShortFormMoveToAbsolute => {
   return (acn as TShortFormMoveToAbsolute).moveToAbsolute !== undefined;
};

export type TShortFormDo = { do: TShortFormAction[] };
const isShortFormDo = (acn: TShortFormAction): acn is TShortFormDo => {
   return (acn as TShortFormDo).do !== undefined;
};

export type TShortFormSetSpeed = { setSpeed: number };
const isShortFormSetSpeed = (acn: TShortFormAction): acn is TShortFormSetSpeed => {
   return (acn as TShortFormSetSpeed).setSpeed !== undefined;
};

/**
 * Just another (useless) helper action.
 * All it does is execute all actions is gets into it.
 * Essentially it flattens the array of arrays
 */
export type TSequence = { seq: TShortFormAction[][] };
const isSequence = (acn: TShortFormAction): acn is TSequence => {
   return (acn as TSequence).seq !== undefined;
};

// Infinite repeat of list of actions.
export type TForever = { forever: TShortFormAction[] };
const isForever = (acn: TShortFormAction): acn is TForever => {
   return (acn as TForever).forever !== undefined;
};

export type TTwice = { twice: TShortFormAction[] };
const isTwice = (acn: TShortFormAction): acn is TTwice => {
   return (acn as TTwice).twice !== undefined;
};

export type TThrice = { thrice: TShortFormAction[] };
const isThrice = (acn: TShortFormAction): acn is TThrice => {
   return (acn as TThrice).thrice !== undefined;
};

export type TShortFormFork = { fork: TShortFormAction[] };
const isShortFormFork = (acn: TShortFormAction): acn is TShortFormFork => {
   return (acn as TShortFormFork).fork !== undefined;
};

export const ShortFormToLongForm = (shortForm: TShortFormAction): TAction => {
   if(isShortFormWait(shortForm)) {
      const { wait } = shortForm;
      return { type: "wait", frames: wait };
   } else if(isShortFormSpawn(shortForm)) {
      const { spawn, x, y, actions } = shortForm;
      return { type: "spawn", enemy: spawn, x, y, actions };
   } else if(isShortFormRepeat(shortForm)) {
      const { repeat, actions } = shortForm;
      return { type: "repeat", times: repeat, actions };
   } else if(isShortFormParallellAll(shortForm)) {
      const { parallellAll } = shortForm;
      return { type: "parallellAll", actionsLists: parallellAll };
   } else if(isShortFormParallellRace(shortForm)) {
      const { parallellRace } = shortForm;
      return { type: "parallellRace", actionsLists: parallellRace };
   } else if(iShortFormAttr(shortForm)) {
      const { attr, is, yes, no } = shortForm;
      return { type: "attr", attrName: attr, is, yes, no };
   } else if(isShortFormSetShotSpeed(shortForm)) {
      const { setShotSpeed } = shortForm;
      return { type: "setShotSpeed", pixelsPerFrame: setShotSpeed };
   }else if(isShortFormMoveToAbsolute(shortForm)) {
      const { moveToAbsolute, frames } = shortForm;
      return { type: "moveToAbsolute", moveTo: moveToAbsolute, frames };
   }else if(isShortFormDo(shortForm)) {
      return { type: "do", acns: shortForm.do };
   }else if(isSequence(shortForm)) {
      return { type: "do", acns: shortForm.seq.flat() };
   }else if(isShortFormSetSpeed(shortForm)) {
      return { type: "setSpeed", pixelsPerFrame: shortForm.setSpeed };
   }else if(isForever(shortForm)) {
      return { type: "repeat", times: 100_000_000, actions: shortForm.forever };
   }else if(isTwice(shortForm)) {
      return { type: "repeat", times: 2, actions: shortForm.twice };
   }else if(isThrice(shortForm)) {
      return { type: "repeat", times: 3, actions: shortForm.thrice };
   } else if(isShortFormFork(shortForm)) {
      return { type: "fork", actions: shortForm.fork };
   }
   return shortForm;
};

export type TShortFormAction =
   Exclude<
      TAction,
      TWait | TSpawn | TRepeat | TAttr | TSetShotSpeed | TMoveToAbsolute | TDo | TSetSpeed |
      { type: "parallellAll" } | { type: "parallellRace" } | TFork
   > |

   TShortFormWait |
   TShortFormSpawn |
   TShortFormRepeat |
   TShortFormParallellAll |
   TShortFormAttr |
   TShortFormSetShotSpeed |
   TShortFormMoveToAbsolute |
   TShortFormDo |
   TSequence |
   TShortFormSetSpeed |
   TShortFormParallellRace |
   TForever |
   TTwice |
   TThrice |
   TShortFormFork
