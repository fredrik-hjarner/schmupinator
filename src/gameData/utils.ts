import type {
   TAction, TRepeat, TSpawn, TWait, TparallelAll
} from "../App/services/Enemies/actions/actionTypes";

export const parallelAll = (...actions: (TAction|TAction[])[]): TparallelAll => ({
   type: "parallelAll",
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

export const wait = (frames: number): TWait => ({ type: "wait", frames });
