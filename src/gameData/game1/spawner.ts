import type { IEnemyJson } from "../../gameTypes/IEnemyJson";

import { fork, spawn, wait } from "../utils";

export const spawner: IEnemyJson = {
   name: "spawner",
   diameter: 20,
   hp: 9999,
   actions: [
      fork(
         wait(3200),
         { type: "finishLevel" },
      ),
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "none" },
      // { wait: 1 },
      spawn("parallax"),
      spawn("player", { x: 178.5, y: 220 }),
      spawn("stage1"),
      // { type: "spawn", enemy: "stage2" },
      // { type: "spawn", enemy: "stage3" },
      // { type: "spawn", enemy: "stage4" },
      // { type: "spawn", enemy: "stage5" },
   ],
};
