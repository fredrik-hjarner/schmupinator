import type { TAction } from "../App/services/Enemies/actions/actionTypes";

/**
 * This is the type of a GameObject used when you create a new GameObject.
 * One can think of this as being a template. When spawning new GameObjects then this "template" is
 * used to create a new GameObject "instances".
 */
export type TGameObject = {
  name: string;
  diameter: number;
  actions: TAction[];
}
