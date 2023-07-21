import type { IEnemyJson } from "@/gameTypes/IEnemyJson";

import {
   spawn,
} from "@/gameData/utils";
import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";

export const dot: IEnemyJson = {
   name: "dot",
   hp: 20,
   diameter: 20,
   onDeathAction: spawn("roundExplosion"),
   actions: [
      { type: AT.gfxSetShape, shape: "stage2/circle.png" },
   ]
};