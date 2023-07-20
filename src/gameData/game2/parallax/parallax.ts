import type { IEnemyJson } from "@/gameTypes/IEnemyJson";

import { forever, spawn, wait } from "@/gameData/utils";

export const parallax: IEnemyJson = {
   name: "parallax",
   diameter: 240,
   hp: 9999,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetColor", color: "black" },
      { type: "gfxSetShape", shape: "square" },
      { type: "gfxFillScreen" },
      spawn("layer1"),
      spawn("layer2"),
      spawn("layer3"),
   ],
};

export const layer1: IEnemyJson = {
   name: "layer1",
   diameter: 240,
   hp: 9999,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "layer1.png" },
      { type: "gfxFillScreen" },
      forever(
         wait(1),
         { type: "gfxScrollBg", x: 0.3 }
      )
   ],
};

export const layer2: IEnemyJson = {
   name: "layer2",
   diameter: 240,
   hp: 9999,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "layer2.png" },
      { type: "gfxFillScreen" },
      forever(
         wait(1),
         { type: "gfxScrollBg", x: 1 }
      )
   ],
};

export const layer3: IEnemyJson = {
   name: "layer3",
   diameter: 240,
   hp: 9999,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "layer3.png" },
      { type: "gfxFillScreen" },
      forever(
         wait(1),
         { type: "gfxScrollBg", x: 1.5 }
      )
   ],
};