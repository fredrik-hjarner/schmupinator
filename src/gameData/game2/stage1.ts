import type { IEnemyJson } from "../../App/services/Enemies/enemyConfigs/IEnemyJson";

import {
   spawn,
   wait
} from "../utils";
import { col, row } from "./common";

export const stage1: IEnemyJson = {
   name: "stage1",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "none" },
      // wait(1),
      // spinner wave 1
      spawn("spinningDots", { x: col[12], y: row[5] }),
      wait(7 * 60),

      // spinner wave 2
      spawn("spinningDots", { x: col[12], y: row[3] }),
      wait(1.5 * 60),
      spawn("spinningDots", { x: col[12], y: row[7] }),
      wait(7 * 60),


      // spinner wave 3
      spawn("spinningDots", { x: col[12], y: row[1] }),
      wait(1.5 * 60),
      spawn("spinningDots", { x: col[12], y: row[5] }),
      wait(1.5 * 60),
      spawn("spinningDots", { x: col[12], y: row[9] }),

   ]
};
