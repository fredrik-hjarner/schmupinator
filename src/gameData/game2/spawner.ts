import type { IEnemyJson } from "../../App/services/Enemies/enemyConfigs/IEnemyJson";

import { fork, spawn, wait } from "../utils";
import { col, row } from "./common";

export const spawner: IEnemyJson = {
   name: "spawner",
   diameter: 20,
   hp: 9999,
   actions: [
      fork(
         wait(300 * 60),
         { type: "finishLevel" },
      ),
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "none" },
      // { wait: 1 },
      spawn("parallax"),
      spawn("player", { x: col[1], y: row[5] }),
      spawn("stage"),
   ],
};
