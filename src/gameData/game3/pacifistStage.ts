import type { IEnemyJson } from "../../App/services/Enemies/enemyConfigs/IEnemyJson";
import type { TSpawn } from "../../App/services/Enemies/actions/actionTypes";

import { Do, repeat, wait } from "../utils";

const sinusLeft: TSpawn = {
   type: "spawn", enemy: "sinus",
   x: 75,
   y: -20,
};

const sinusRight: TSpawn = {
   type: "spawn", enemy: "sinus",
   x: 280,
   y: -20,
   actions: [
      { type: "setAttribute", attribute: "right", value: true }
   ],
};

const sinuses = repeat(5, [
   Do(sinusLeft, wait(70)),
   Do(sinusRight, wait(70)),
]);

export const pacifistStage: IEnemyJson = {
   name: "pacifistStage",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "none" },
      wait(120),
      sinuses,
   ],
};