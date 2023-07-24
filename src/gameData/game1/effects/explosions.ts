import type { IEnemyJson } from "../../../gameTypes/IEnemyJson";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import { createGameObject, wait } from "../../utils";

export const explosion: IEnemyJson = createGameObject({
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

export const roundExplosion: IEnemyJson = createGameObject({
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
