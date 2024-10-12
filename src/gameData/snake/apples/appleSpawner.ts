import type {  TAction } from "../../../App/services/Enemies/actions/actionTypes.ts";

import { resolutionHeight, resolutionWidth } from "@/consts.ts";

import { ActionType as AT } from "../../../App/services/Enemies/actions/actionTypes.ts";
import {
   createGameObject,
   forever,
   fork,
   spawn,
   wait
} from "../../utils/utils.ts";

const spawnApple = (): TAction => spawn(
   "apple", {
      x: { min: 0, max: resolutionWidth },
      y: { min: 0, max: resolutionHeight }
   },
);

export const appleSpawner = createGameObject({
   name: "appleSpawner",
   diameter: 17,
   hp: 1,
   // onDeathAction: { type: AT.finishLevel }, // TODO: finishLevel should maybe be called gameOver.
   actions: [
      { type: AT.setAttribute, attribute: "points", value: 0 },
      { type: AT.gfxSetColor, color: "red" },
      { type: AT.setMoveDirection, degrees: 90 },
      { type: AT.setAttribute, attribute: "collisionType", value: "player" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      { type: AT.gfxSetShape, shape: "none" },
      { type: AT.incr, attribute: "speed", amount: 0 },
      fork(forever(
         spawnApple(),
         wait(60 * 4),
      ))
   ]
});