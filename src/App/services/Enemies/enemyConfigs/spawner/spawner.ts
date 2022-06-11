import type { IEnemyJson } from "../IEnemyJson";

/**
 * The "spawner" enemy is not a normal enemy.
 * It can do everything that an enemy can do, but it's
 * primary purpose is to auto-spawn at [0, 0] and
 * be resposible for spawning enemies.
 */
export const spawner: IEnemyJson = {
   name: "spawner",
   diameter: 20,
   hp: 9999,
   spawnOnFrame: 1,
   startPosition: { x: 0, y: 0 },
   actions: [
      { type: "repeat", times: 10, actions: [
         { type: 'wait', frames: 30 },
         { type: 'spawn', enemy: "nonShootingAimer", position: { x: 50, y: 0} }
      ] }
   ]
};
