import type {
   TAction, TFork, TRepeat, TSpawn, TWait, TparallelAll, TparallelRace
} from "../App/services/Enemies/actions/actionTypes";

export const forever = (...actions: TAction[]): TRepeat => ({
   type: "repeat",
   times: 100_000_000,
   // @ts-ignore: TODO: fix type
   actions
});

export const fork = (...actions: TAction[]): TFork => ({
   type: "fork",
   // @ts-ignore: TODO: fix type
   actions
});

export const parallelAll = (...actions: (TAction|TAction[])[]): TparallelAll => ({
   type: "parallelAll",
   // @ts-ignore: TODO: fix type
   actionsLists: actions.map(acns => Array.isArray(acns) ? acns : [acns])
});

export const parallelRace = (...actions: (TAction|TAction[])[]): TparallelRace => ({
   type: "parallelRace",
   // @ts-ignore: TODO: fix type
   actionsLists: actions.map(acn => Array.isArray(acn) ? acn : [acn])
});

export const repeat = (times: number, actions: TAction[]): TRepeat => ({
   type: "repeat",
   times,
   // @ts-ignore: TODO: fix type
   actions
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
   // @ts-ignore: TODO: fix type
   actions: params?.actions
});

export const thrice = (...actions: TAction[]): TRepeat => repeat(3, actions);

export const twice = (...actions: TAction[]): TRepeat => repeat(2, actions);

export const wait = (frames: number): TWait => ({ type: "wait", frames });
