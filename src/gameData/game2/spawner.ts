import type { TGameObject } from "../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import { createGameObject, fork, spawn, wait } from "../utils/utils";
import { col, row } from "./common";

export const spawner: TGameObject = createGameObject({
   name: "spawner",
   diameter: 20,
   hp: 9999,
   actions: [
      fork(
         wait(300 * 60),
         { type: AT.finishLevel },
      ),
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "none" },
      // { wait: 1 },
      spawn("parallax"),
      spawn("player", { x: col[1], y: row[5] }),
      spawn("stage"),
   ],
});
