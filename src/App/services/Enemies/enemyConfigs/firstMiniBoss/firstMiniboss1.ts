import type { IEnemyJson } from "../IEnemyJson";

import { resolutionWidth } from "../../../../../consts";
import { firstMiniBossMoveActions1 } from "./moveActions";
import { firstMiniBossShootActions } from "./shootActions";
import { uuid } from "../../../../../utils/uuid";

export const firstMiniBoss1: IEnemyJson = {
   name: `${uuid()}`,
   spawnOnFrame: 60*24,
   hp: 120,
   diameter: 35,
   startPosition: {
      x: resolutionWidth*0.333,
      y: -20
   },
   actions: [
      { type: "parallell_race", actionsLists: [
         firstMiniBossShootActions,
         firstMiniBossMoveActions1
      ] }
   ]
};
