import type { IEnemyJson } from "../IEnemyJson";

import { resolutionWidth } from "../../../../../consts";
import { firstMiniBossMoveActions2 } from "./moveActions";
import { firstMiniBossShootActions } from "./shootActions";
import { uuid } from "../../../../../utils/uuid";

export const firstMiniBoss2: IEnemyJson = {
  name: `${uuid()}`,
  spawnOnFrame: 60*10,
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
