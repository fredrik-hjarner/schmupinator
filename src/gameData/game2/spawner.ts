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
            wait(100),
            { type: "finishLevel" }
         ]
      },
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "none" },
      // { wait: 1 },
      spawn("player", { x: 178.5, y: 220 }),
      spawn("pacifistStage")
   ]
};
