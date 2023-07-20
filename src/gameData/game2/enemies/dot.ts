import type { IEnemyJson } from "@/gameTypes/IEnemyJson";

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