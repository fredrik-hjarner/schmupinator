import { TAction } from "../actionTypes";

export interface IEnemyJson {
  name: string;
  hp: number;
  diameter: number;
  actions: TAction[];
}
