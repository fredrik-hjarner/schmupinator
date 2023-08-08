import { ActionType as AT } from "../../../App/services/Enemies/actions/actionTypes";
import {
   col,
   createGameObject,
   forever,
   fork,
   row,
   spawn,
   wait
} from "../../utils/utils";

export const appleSpawner = createGameObject({
   name: "appleSpawner",
   diameter: 17,
   hp: 1,
   // onDeathAction: { type: AT.finishLevel }, // TODO: finishLevel should maybe be called gameOver.
   options: { despawnWhenOutsideScreen: false, defaultDirectionalControls: false },
   actions: [
      { type: AT.setAttribute, attribute: "points", value: 0 },
      { type: AT.gfxSetColor, color: "red" },
      { type: AT.setMoveDirection, degrees: 90 },
      { type: AT.setAttribute, attribute: "collisionType", value: "player" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      { type: AT.gfxSetShape, shape: "none" },
      { type: AT.incr, attribute: "speed", amount: 0 },
      fork(forever(
         spawn("apple", { x: col[1], y: row[1] }),
         wait(60 * 1.5),
         spawn("apple", { x: col[2], y: row[2] }),
         wait(60 * 1.5),
         spawn("apple", { x: col[3], y: row[3] }),
         wait(60 * 1.5),
         spawn("apple", { x: col[4], y: row[4] }),
         wait(60 * 1.5),
         spawn("apple", { x: col[5], y: row[5] }),
         wait(60 * 1.5),
      ))
   ]
});