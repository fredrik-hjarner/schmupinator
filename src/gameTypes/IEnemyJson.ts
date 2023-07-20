import type { TAction } from "../App/services/Enemies/actions/actionTypes";

/**
 * This is the type of a GameObject used when you create a new GameObject.
 * One can think of this as being a template. When spawning new GameObjects then this "template" is
 * used to create a new GameObject "instances".
 */
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
