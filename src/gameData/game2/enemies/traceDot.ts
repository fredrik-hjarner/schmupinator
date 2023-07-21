import type { IEnemyJson } from "@/gameTypes/IEnemyJson";

import { wait } from "@/gameData/utils";
import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";

export const traceDot: IEnemyJson = {
   name: "traceDot",
   hp: 9999,
   diameter: 5,
   actions: [
      wait(3 * 60),
      { type: AT.despawn }
   ]
};