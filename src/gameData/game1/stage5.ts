import type { IEnemyJson } from "../../App/services/Enemies/enemyConfigs/IEnemyJson";

import { forever, spawn, wait } from "../utils";
import { col, row } from "./common";

export const stage5: IEnemyJson = {
   name: "stage5",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: "gfxSetShape", shape: "none" },
      spawn("aqua", { x: col[3], y: row[3] }),
      spawn("executor", { x: col[5], y: row[5] }),
   ],
};

export const executor: IEnemyJson = {
   name: "executor",
   diameter: 30,
   hp: 100_000,
   actions: [
      { type: "gfxSetColor", color: "green" },
      forever(
         { type: "setAttribute", gameObjectId: "global", attribute: "aquaShoot", value: true },
         wait(1),
         { type: "setAttribute", gameObjectId: "global", attribute: "aquaShoot", value: false },
         wait(35),
      )
   ],
};

export const aqua: IEnemyJson = {
   name: "aqua",
   diameter: 30,
   hp: 100_000,
   actions: [
      { type: "gfxSetColor", color: "aqua" },
      { type: "setShotSpeed", pixelsPerFrame: 2 },
      forever(
         { type:"waitUntilAttrIs", gameObjectId: "global", attr: "aquaShoot", is: true },
         { type: "shootDirection", x: 0, y: 1 },
         wait(1),
      )
   ],
};