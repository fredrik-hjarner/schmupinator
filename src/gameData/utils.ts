import type {
   TAction, TAttrIs, TDo, TFork, TMoveToAbsolute, TRepeat, TSetShotSpeed, TSetSpeed,
   TSpawn, TWait, TparallelAll,TparallelRace
} from "../App/services/Enemies/actions/actionTypes";

type TAttrParams = {
   is: TAttrIs["is"];
   yes?: TAttrIs["yes"];
   no?: TAttrIs["no"];
};
export const attr = (attrName: TAttrIs["attrName"], { is, yes, no }: TAttrParams): TAttrIs => ({
   type: "attrIs",
   attrName,
   is,
   yes,
   no
});

// first caps because `do` is a reserved word in js.
export const Do = (...actions: TAction[]): TDo => ({
   type: "do",
   acns: actions
});

export const forever = (...actions: TAction[]): TRepeat => ({
   type: "repeat",
   times: 100_000_000,
   actions
});

export const fork = (...actions: TAction[]): TFork => ({
   type: "fork",
   actions
});

type TMoveToAbsParams = { x?: number, y?: number, frames: number};
export const moveToAbsolute = ({ x, y, frames }: TMoveToAbsParams): TMoveToAbsolute => ({
   type: "moveToAbsolute",
   moveTo: { x, y },
   frames
});

export const parallelAll = (...actions: (TAction|TAction[])[]): TparallelAll => ({
   type: "parallelAll",
   actionsLists: actions.map(acns => Array.isArray(acns) ? acns : [acns])
});

export const parallelRace = (...actions: (TAction|TAction[])[]): TparallelRace => ({
   type: "parallelRace",
   actionsLists: actions.map(acn => Array.isArray(acn) ? acn : [acn])
});

export const repeat = (times: number, actions: TAction[]): TRepeat => ({
   type: "repeat",
   times,
   actions
});

export const setSpeed = (pixelsPerFrame: number): TSetSpeed => ({
   type: "setSpeed",
   pixelsPerFrame
});

type TSpawnParams = {
   x?: number;
   y?: number;
   actions?: (TAction)[]
}
export const spawn = (enemy: string, params?: TSpawnParams): TSpawn => ({
   type: "spawn",
   enemy,
   x: params?.x,
   y: params?.y,
   actions: params?.actions
});

export const setShotSpeed = (pixelsPerFrame: number): TSetShotSpeed => ({
   type: "setShotSpeed",
   pixelsPerFrame
});

export const thrice = (...actions: TAction[]): TRepeat => repeat(3, actions);

export const twice = (...actions: TAction[]): TRepeat => repeat(2, actions);

export const wait = (frames: number): TWait => ({ type: "wait", frames });
