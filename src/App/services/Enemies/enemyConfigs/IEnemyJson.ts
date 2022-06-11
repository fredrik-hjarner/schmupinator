import type { TShortFormAction } from "../actionTypesShortForms";

export interface IEnemyJson {
  name: string;
  hp: number;
  diameter: number;
  actions: TShortFormAction[];
}
