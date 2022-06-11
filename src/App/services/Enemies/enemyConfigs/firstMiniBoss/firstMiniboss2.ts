import type { IEnemyJson } from "../IEnemyJson";

import { resolutionWidth } from "../../../../../consts";
import { firstMiniBossMoveActions2 } from "./moveActions";
import { firstMiniBossShootActions } from "./shootActions";

export const firstMiniBoss2: IEnemyJson = {
   name: "firstMiniboss2",
   spawnOnFrame: 60*24,
   hp: 120,
   diameter: 35,
   startPosition: {
      x: resolutionWidth*0.666,
      y: -20
   },
   actions: [
      { type: "parallell_race", actionsLists: [
         firstMiniBossShootActions,
         firstMiniBossMoveActions2
      ] }
   ]
};
