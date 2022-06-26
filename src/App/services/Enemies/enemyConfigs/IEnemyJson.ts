import type { TShortFormAction } from "../actionTypesShortForms";

export interface IEnemyJson {
  name: string;
  hp: number; // actually maxHp
  diameter: number;
  actions: TShortFormAction[];
}
