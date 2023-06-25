import type { TAction } from "../actions/actionTypes";

export type IEnemyJson = {
  name: string;
  hp: number; // actually maxHp
  diameter: number;
  actions: TAction[];
  /**
   * One action that is executed immediately when an enemy dies.
   * MUST take at most 1 frame to execute.
   * The reason for this is that the enemy has died and is
   * being removed from the system, 
   */
  onDeathAction?: TAction;
}
