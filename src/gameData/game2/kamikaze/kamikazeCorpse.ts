import { wait } from "../../utils";

export const kamikaze = {
   name: "kamikaze",
   diameter: 20,
   hp: 1,
   onDeathAction: { spawn: "kamikazeCorpse" },
   actions: [
      { type: "gfxSetShape", shape: "octagon" },
      { type: "gfxSetColor", color: "red" },
      wait(90),
      // { type: "die" },
   ],
};

export const kamikazeCorpse = {
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
