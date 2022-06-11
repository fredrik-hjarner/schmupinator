import type { IEnemyJson } from "./IEnemyJson";

import { createNonShootingAimer } from "./nonShootingAimer/nonShootingAimer";
import { firstMiniBoss1 } from "./firstMiniBoss/firstMiniboss1";
import { firstMiniBoss2 } from "./firstMiniBoss/firstMiniboss2";
import { resolutionWidth } from "../../../../consts";
import { createLeftSinus } from "./sinus/sinusLeft";
import { createRightSinus } from "./sinus/sinusRight";
import { spawner } from "./spawner/spawner";

const startSpawnAimers = 80;
const startSpawnSinus = 40*8 + 60*4;

const createAimerPair = (
   { spawnOnFrame, distanceBetween }: { spawnOnFrame: number, distanceBetween: number }
) => [
   createNonShootingAimer({
      spawnOnFrame: spawnOnFrame + startSpawnAimers,
      spawnPosition: {x: resolutionWidth/2 - distanceBetween/2, y: -22}
   }),
   createNonShootingAimer({
      spawnOnFrame: spawnOnFrame + startSpawnAimers,
      spawnPosition: {x: resolutionWidth/2 + distanceBetween/2, y: -22}
   }),
];

export const enemyJsons: IEnemyJson[] = [
   spawner,
   ...createAimerPair({ spawnOnFrame: 40*1, distanceBetween: 100 }),
   ...createAimerPair({ spawnOnFrame: 40*2, distanceBetween: 100 }),
   ...createAimerPair({ spawnOnFrame: 40*3, distanceBetween: 100 }),
   ...createAimerPair({ spawnOnFrame: 40*4, distanceBetween: 100 }),
   ...createAimerPair({ spawnOnFrame: 40*5, distanceBetween: 100 }),
   ...createAimerPair({ spawnOnFrame: 40*6, distanceBetween: 100 }),
   ...createAimerPair({ spawnOnFrame: 40*7, distanceBetween: 100 }),
   ...createAimerPair({ spawnOnFrame: 40*8, distanceBetween: 100 }),

   createLeftSinus({spawnOnFrame: startSpawnSinus + 70*0}),
   createRightSinus({spawnOnFrame: startSpawnSinus + 70*1}),
   createLeftSinus({spawnOnFrame: startSpawnSinus + 70*2}),
   createRightSinus({spawnOnFrame: startSpawnSinus + 70*3}),
   createLeftSinus({spawnOnFrame: startSpawnSinus + 70*4}),
   createRightSinus({spawnOnFrame: startSpawnSinus + 70*5}),
   createLeftSinus({spawnOnFrame: startSpawnSinus + 70*6}),
   createRightSinus({spawnOnFrame: startSpawnSinus + 70*7}),
   createLeftSinus({spawnOnFrame: startSpawnSinus + 70*8}),
   createRightSinus({spawnOnFrame: startSpawnSinus + 70*9}),

   firstMiniBoss1,
   firstMiniBoss2
];