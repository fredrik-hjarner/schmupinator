import type { IEnemyJson } from "@/App/services/Enemies/enemyConfigs/IEnemyJson";

import {
   forever,
   fork,
   // forever,
   // parallelAll,
   // repeat,
   // setSpeed,
   spawn,
   // wait,
} from "@/gameData/utils";

export const dot: IEnemyJson = {
   name: "dot",
   hp: 20,
   diameter: 20,
   onDeathAction: spawn("roundExplosion"),
   actions: [
      { type: "gfxSetShape", shape: "stage2/circle.png" },
      fork(forever(
         { type: "moveDelta", x: -0.55 },
         { type: "waitNextFrame" },
      )),
      // fork(forever(
      //    spawn("traceDot"),
      //    { type: "wait", frames: 15 },
      // )),
   ]
};