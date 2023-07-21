import type { IEnemyJson } from "../../gameTypes/IEnemyJson";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";

export const shot: IEnemyJson = {
   name: "shot",
   hp: 9999,
   diameter: 5,
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "enemyBullet" },
      { type: AT.setAttribute, attribute: "points", value: 0 },
      { type: "gfxSetShape", shape: "circle" }
   ]
};
