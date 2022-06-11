import type { IEnemyJson } from "../IEnemyJson";

import { firstMiniBossMoveActions1 } from "./moveActions";
import { firstMiniBossShootActions } from "./shootActions";

export const firstMiniBoss1: IEnemyJson = {
   name: "firstMiniboss1",
   hp: 120,
   diameter: 35,
   actions: [
      { type: "parallell_race", actionsLists: [
         firstMiniBossShootActions,
         firstMiniBossMoveActions1
      ] }
   ]
};
