import type { IEnemyJson } from "./IEnemyJson";

import { createNonShootingAimer } from "./nonShootingAimer/nonShootingAimer";
import { firstMiniBoss1 } from "./firstMiniBoss/firstMiniboss1";
import { firstMiniBoss2 } from "./firstMiniBoss/firstMiniboss2";
import { resolutionWidth } from "../../../../consts";

const createAimerPair = (
  { spawnOnFrame, distanceBetween }: { spawnOnFrame: number, distanceBetween: number }
) => [
  createNonShootingAimer({
    spawnOnFrame,
    spawnPosition: {x: resolutionWidth/2 - distanceBetween/2, y: -22}
  }),
  createNonShootingAimer({
    spawnOnFrame,
    spawnPosition: {x: resolutionWidth/2 + distanceBetween/2, y: -22}
  }),
];

export const enemyJsons: IEnemyJson[] = [
  ...createAimerPair({ spawnOnFrame: 40*1, distanceBetween: 100 }),
  ...createAimerPair({ spawnOnFrame: 40*2, distanceBetween: 100 }),
  ...createAimerPair({ spawnOnFrame: 40*3, distanceBetween: 100 }),
  ...createAimerPair({ spawnOnFrame: 40*4, distanceBetween: 100 }),
  ...createAimerPair({ spawnOnFrame: 40*5, distanceBetween: 100 }),
  ...createAimerPair({ spawnOnFrame: 40*6, distanceBetween: 100 }),
  ...createAimerPair({ spawnOnFrame: 40*7, distanceBetween: 100 }),
  ...createAimerPair({ spawnOnFrame: 40*8, distanceBetween: 100 }),

  firstMiniBoss1,
  firstMiniBoss2
];