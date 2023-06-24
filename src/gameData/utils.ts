import type { TWait } from "../App/services/Enemies/actions/actionTypes";

export const wait = (frames: number): TWait => ({ type: "wait", frames });