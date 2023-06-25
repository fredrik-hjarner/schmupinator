import type { IEnemyJson } from "../../../App/services/Enemies/enemyConfigs/IEnemyJson";

import { parallelRace, spawn, wait } from "../../utils";

export const playerLaser: IEnemyJson = {
   name: "playerLaser",
   hp: 1,
   diameter: 5,
   // @ts-ignore
   onDeathAction: spawn("explosion"),
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "playerBullet" },
      // TODO: is points really necessary for this?
      { type: "setAttribute", attribute: "pointsOnDeath", value: -0.2 },
      { type: "setAttribute", attribute: "points", value: 0 },
      { type: "gfxSetShape", shape: "square" },
      { type: "gfxSetColor", color: "aqua" },
      parallelRace(
         {
            // @ts-ignore
            forever: [
               // @ts-ignore
               { type: "moveDelta", y: -30 },
               // @ts-ignore
               { type: "waitNextFrame" },
            ]
         },
         [
            // @ts-ignore
            wait(8),
            // @ts-ignore
            { type: "despawn" }
         ]
      ),
   ]
};
