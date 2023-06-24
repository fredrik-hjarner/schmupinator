import type { TAction, TRepeat, TSpawn, TWait } from "../App/services/Enemies/actions/actionTypes";

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
