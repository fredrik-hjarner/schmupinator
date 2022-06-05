import type { IEnemyJson } from "../IEnemyJson";

import { resolutionWidth } from "../../../../../consts";
import { firstMiniBossMoveActions1 } from "./moveActions";
import { firstMiniBossShootActions } from "./shootActions";
import { uuid } from "../../../../../utils/uuid";

export const firstMiniBoss1: IEnemyJson = {
  name: `${uuid()}`,
  spawnOnFrame: 60*5,
  hp: 120,
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
