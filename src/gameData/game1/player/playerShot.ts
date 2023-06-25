import type { IEnemyJson } from "../../../App/services/Enemies/enemyConfigs/IEnemyJson";

import { spawn } from "../../utils";

export const playerShot: IEnemyJson = {
   name: "playerShot",
   hp: 1,
   diameter: 5,
   onDeathAction: spawn("explosion"),
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "playerBullet" },
      // TODO: is points really necessary for this?
      { type: "setAttribute", attribute: "pointsOnDeath", value: -1 },
      { type: "setAttribute", attribute: "points", value: 0 },
      { type: "gfxSetShape", shape: "circle" },
      { type: "gfxSetColor", color: "aqua" },
   ],
};
