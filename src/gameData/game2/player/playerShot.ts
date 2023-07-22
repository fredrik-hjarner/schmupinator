import type { IEnemyJson } from "../../../gameTypes/IEnemyJson";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import { spawn } from "../../utils";

export const playerShot: IEnemyJson = {
   name: "playerShot",
   hp: 1,
   diameter: 5,
   onDeathAction: spawn("explosion"),
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "playerBullet" },
      // TODO: is points really necessary for this?
      { type: AT.setAttribute, attribute: "pointsOnDeath", value: -1 },
      { type: AT.setAttribute, attribute: "points", value: 0 },
      { type: AT.gfxSetShape, shape: "circle" },
      { type: AT.gfxSetColor, color: "aqua" },
   ],
};
