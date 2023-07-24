import type { TGameObject } from "./TGameObject";

/**
 * This is the type for a game/level used when you create a level.
 */
export type TGame = {
   /** All gameObjects used by the game (i.e. all that are spawned) must be added here. */
   gameObjects: TGameObject[];
   /** This is the image that is displayed when you start the game */
   startScreenImageUrl: string;
};
