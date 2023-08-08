import type { TGameObject } from "../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import { createGameObject, spawn } from "../utils/utils";

export const shot: TGameObject = createGameObject({
   name: "shot",
   hp: 1,
   diameter: 5,
   options: { despawnMargin: 5 },
   onDeathAction: spawn("explosion"),
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "enemyBullet" },
      { type: AT.setAttribute, attribute: "points", value: 0 },
      { type: AT.gfxSetShape, shape: "circle" }
   ]
});