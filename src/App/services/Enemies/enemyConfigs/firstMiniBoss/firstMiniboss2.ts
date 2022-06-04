import type { IEnemyJson } from "../IEnemyJson";

import { resolutionWidth } from "../../../../../consts";
import { firstMiniBossMoveActions2 } from "./moveActions";
import { firstMiniBossShootActions } from "./shootActions";
import { uuid } from "../../../../../utils/uuid";

export const firstMiniBoss2: IEnemyJson = {
  name: `${uuid()}`,
  hp: 120,
  startPosition: {
    x: resolutionWidth*0.666,
    y: -20
  },
  actionsLists: [
    firstMiniBossShootActions,
    firstMiniBossMoveActions2
  ]
};
