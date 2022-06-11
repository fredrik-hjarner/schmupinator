import type { IEnemyJson } from "./IEnemyJson";

import { nonShootingAimer } from "./nonShootingAimer/nonShootingAimer";
import { firstMiniBoss1 } from "./firstMiniBoss/firstMiniboss1";
import { firstMiniBoss2 } from "./firstMiniBoss/firstMiniboss2";
import { leftSinus } from "./sinus/sinusLeft";
import { rightSinus } from "./sinus/sinusRight";
import { spawner } from "./spawner/spawner";

export const enemyJsons: IEnemyJson[] = [
   spawner,
   nonShootingAimer,
   leftSinus,
   rightSinus,
   firstMiniBoss1,
   firstMiniBoss2
];