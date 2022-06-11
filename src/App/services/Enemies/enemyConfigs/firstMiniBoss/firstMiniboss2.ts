import type { IEnemyJson } from "../IEnemyJson";

import { firstMiniBossMoveActions2 } from "./moveActions";
import { firstMiniBossShootActions } from "./shootActions";

export const firstMiniBoss2: IEnemyJson = {
   name: "firstMiniboss2",
   hp: 120,
   diameter: 35,
   actions: [
      { type: "parallell_race", actionsLists: [
         firstMiniBossShootActions,
         firstMiniBossMoveActions2
      ] }
   ]
};
