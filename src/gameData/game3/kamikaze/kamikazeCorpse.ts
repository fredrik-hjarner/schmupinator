import type { IEnemyJson } from "../../../gameTypes/IEnemyJson";

import { wait } from "../../utils";

export const kamikaze: IEnemyJson = {
   name: "kamikaze",
   diameter: 20,
   hp: 1,
   onDeathAction: { type: "spawn", enemy: "kamikazeCorpse" },
   actions: [
      { type: "gfxSetShape", shape: "octagon" },
      { type: "gfxSetColor", color: "red" },
      wait(90),
      // { type: "die" },
   ],
};

export const kamikazeCorpse: IEnemyJson = {
   name: "kamikazeCorpse",
   diameter: 20,
   hp: 1,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "none" },
      { type: "setShotSpeed", pixelsPerFrame: 0.9 },
      { type: "shootDirection", x: 1, y: -1 },
      { type: "shootDirection", x: 1, y: 0 },
      { type: "shootDirection", x: 1, y: 1 },
      { type: "shootDirection", x: 0, y: 1 },
      { type: "shootDirection", x: -1, y: 1 },
      { type: "shootDirection", x: -1, y: 0 },
      { type: "shootDirection", x: -1, y: -1 },
      { type: "shootDirection", x: 0, y: -1 },
      { type: "despawn" },
   ],
};
