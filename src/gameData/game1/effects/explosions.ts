import type { IEnemyJson } from "../../../App/services/Enemies/enemyConfigs/IEnemyJson";

import { wait } from "../../utils";

export const explosion: IEnemyJson = {
   name: "explosion",
   diameter: 18,
   hp: 9999,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "explosion" },
      wait(40),
      // { type: "wait", frames: 40 },
      { type: "despawn" },
   ],
};

export const roundExplosion: IEnemyJson = {
   name: "roundExplosion",
   diameter: 40,
   hp: 9999,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "roundExplosion" },
      wait(75),
      // { type: "wait", frames: 75 },
      { type: "despawn" },
   ],
};
