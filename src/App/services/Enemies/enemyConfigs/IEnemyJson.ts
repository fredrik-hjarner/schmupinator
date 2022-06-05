import { Vector as TVector } from "../../../../math/bezier";
import { TAction } from "../actionTypes";

export interface IEnemyJson {
  name: string;
  // This enemy should spawn on this frame, it does not exist before.
  spawnOnFrame: number,
  hp: number;
  startPosition: TVector;
  actions: TAction[];
}
