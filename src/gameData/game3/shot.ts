import type { TGameObject } from "../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes.ts";
import { createGameObject } from "../utils/utils.ts";

export const shot: TGameObject = createGameObject({
   name: "shot",
   hp: 9999,
   diameter: 5,
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "enemyBullet" },
      { type: AT.setAttribute, attribute: "points", value: 0 },
      { type: AT.gfxSetShape, shape: "circle" }
   ]
});
