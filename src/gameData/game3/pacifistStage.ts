import type { IEnemyJson } from "../../gameTypes/IEnemyJson";
import type { TSpawn } from "../../App/services/Enemies/actions/actionTypes";

import { ActionType as AT} from "../../App/services/Enemies/actions/actionTypes";
import { Do, createGameObject, repeat, wait } from "../utils";

const sinusLeft: TSpawn = {
   type: AT.spawn, enemy: "sinus",
   x: 75,
   y: -20,
};

const sinusRight: TSpawn = {
   type: AT.spawn, enemy: "sinus",
   x: 280,
   y: -20,
   actions: [
      { type: AT.setAttribute, attribute: "right", value: true }
   ],
};

const sinuses = repeat(5, [
   Do(sinusLeft, wait(70)),
   Do(sinusRight, wait(70)),
]);

export const pacifistStage: IEnemyJson = createGameObject({
   name: "pacifistStage",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "none" },
      wait(120),
      sinuses,
   ],
});
