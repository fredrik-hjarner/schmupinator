import type { IEnemyJson } from "../../App/services/Enemies/enemyConfigs/IEnemyJson";

import { spawn, wait } from "../utils";

export const spawner: IEnemyJson = {
   name: "spawner",
   diameter: 20,
   hp: 9999,
   actions: [
      {
         fork: [
            // @ts-ignore
            wait(3200),
            { type: "finishLevel" },
         ],
      },
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "none" },
      // { wait: 1 },
      spawn("player", { x: 178.5, y: 220 }),
      spawn("stage1"),
      // { type: "spawn", enemy: 'stage2' },
      // { type: "spawn", enemy: 'stage3' },
      // { type: "spawn", enemy: 'stage4' },
   ],
};
