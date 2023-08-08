import type { TGameObject } from "../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import {
   col,
   createGameObject,
   row,
   spawn,
} from "../utils/utils";

export const spawner: TGameObject = createGameObject({
   name: "spawner",
   diameter: 20,
   hp: 9999,
   options: { despawnWhenOutsideScreen: false, invincible: true },
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "none" },
      spawn("parallax"),
      spawn("player", { x: col[5], y: row[5] }),
   ],
});