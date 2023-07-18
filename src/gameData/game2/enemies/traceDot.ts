import type { IEnemyJson } from "@/App/services/Enemies/enemyConfigs/IEnemyJson";

import { wait } from "@/gameData/utils";

export const traceDot: IEnemyJson = {
   name: "traceDot",
   hp: 9999,
   diameter: 5,
   actions: [
      wait(3 * 60),
      { type: "despawn" }
   ]
};