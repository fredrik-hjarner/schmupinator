import type { TGameObject } from "../../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import { createGameObject, wait } from "../../utils";

export const explosion: TGameObject = createGameObject({
   name: "explosion",
   diameter: 18,
   hp: 9999,
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "explosion" },
      wait(40),
      // { type: "wait", frames: 40 },
      { type: AT.despawn },
   ],
});

export const roundExplosion: TGameObject = createGameObject({
   name: "roundExplosion",
   diameter: 40,
   hp: 9999,
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "roundExplosion" },
      wait(75),
      // { type: "wait", frames: 75 },
      { type: AT.despawn },
   ],
});
