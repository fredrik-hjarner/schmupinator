import type { TShortFormAction } from "../actionTypesShortForms";

export interface IEnemyJson {
  name: string;
  hp: number;
  diameter: number;
  /**
   * Flags allow you to put in string into an instantiated Enemy,
   * and later check for the flag with flag action to enable executing actions
   * conditionally.
   */
  flags?: string[];
  actions: TShortFormAction[];
}
