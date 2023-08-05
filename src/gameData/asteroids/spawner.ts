import type { TGameObject } from "../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import {
   createGameObject,
   spawn,
} from "../utils/utils";

export const spawner: TGameObject = createGameObject({
   name: "spawner",
   diameter: 20,
   hp: 9999,
   options: { despawnWhenOutsideScreen: false, invincible: true },
   actions: [
      // fork(
      //    wait(3200),
      //    { type: AT.finishLevel },
      // ),
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "none" },
      // { wait: 1 },
      spawn("parallax"),
      spawn("player", { x: 178.5, y: 220 }),
   ],
});
