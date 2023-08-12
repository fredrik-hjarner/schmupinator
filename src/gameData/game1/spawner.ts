import type { TGameObject } from "../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes.ts";
import { createGameObject, fork, spawn, wait } from "../utils/utils.ts";

export const spawner: TGameObject = createGameObject({
   name: "spawner",
   diameter: 20,
   hp: 9999,
   options: { despawnWhenOutsideScreen: false, invincible: true },
   actions: [
      fork(
         wait(3200),
         { type: AT.finishLevel },
      ),
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "none" },
      // { wait: 1 },
      spawn("parallax"),
      spawn("player", { x: 178.5, y: 220 }),
      spawn("stage1"),
      // { type: "spawn", enemy: "stage2" },
      // { type: "spawn", enemy: "stage3" },
      // { type: "spawn", enemy: "stage4" },
      // spawn("stage5"),
   ],
});
