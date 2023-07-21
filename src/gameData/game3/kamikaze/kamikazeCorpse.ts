import type { IEnemyJson } from "../../../gameTypes/IEnemyJson";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import { wait } from "../../utils";

export const kamikaze: IEnemyJson = {
   name: "kamikaze",
   diameter: 20,
   hp: 1,
   onDeathAction: { type: AT.spawn, enemy: "kamikazeCorpse" },
   actions: [
      { type: AT.gfxSetShape, shape: "octagon" },
      { type: AT.gfxSetColor, color: "red" },
      wait(90),
      // { type: "die" },
   ],
};

export const kamikazeCorpse: IEnemyJson = {
   name: "kamikazeCorpse",
   diameter: 20,
   hp: 1,
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "none" },
      { type: AT.setShotSpeed, pixelsPerFrame: 0.9 },
      { type: AT.shootDirection, x: 1, y: -1 },
      { type: AT.shootDirection, x: 1, y: 0 },
      { type: AT.shootDirection, x: 1, y: 1 },
      { type: AT.shootDirection, x: 0, y: 1 },
      { type: AT.shootDirection, x: -1, y: 1 },
      { type: AT.shootDirection, x: -1, y: 0 },
      { type: AT.shootDirection, x: -1, y: -1 },
      { type: AT.shootDirection, x: 0, y: -1 },
      { type: AT.despawn },
   ],
};
