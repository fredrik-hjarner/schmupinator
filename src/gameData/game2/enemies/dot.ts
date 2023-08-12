import type { TGameObject } from "@/gameTypes/TGameObject";

import {
   createGameObject,
   spawn,
} from "@/gameData/utils/utils.ts";
import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes.ts";

export const dot: TGameObject = createGameObject({
   name: "dot",
   hp: 20,
   diameter: 20,
   onDeathAction: spawn("roundExplosion"),
   actions: [
      { type: AT.gfxSetShape, shape: "stage2/circle.png" },
   ]
});