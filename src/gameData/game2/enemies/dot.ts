import type { IEnemyJson } from "@/App/services/Enemies/enemyConfigs/IEnemyJson";

import {
   spawn,
} from "@/gameData/utils";

export const dot: IEnemyJson = {
   name: "dot",
   hp: 20,
   diameter: 20,
   onDeathAction: spawn("roundExplosion"),
   actions: [
      { type: "gfxSetShape", shape: "stage2/circle.png" },
   ]
};