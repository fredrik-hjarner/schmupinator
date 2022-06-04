import { Vector as TVector } from "../../../../math/bezier";
import { TAction } from "../actionTypes";

export interface IEnemyJson {
  name: string;
  hp: number;
  startPosition: TVector;
  actionsLists: TAction[][];
}
