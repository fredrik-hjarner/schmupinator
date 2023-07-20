import type { IEnemyJson } from "@/gameTypes/IEnemyJson";
import type { TAction } from "@/App/services/Enemies/actions/actionTypes";

import {
   forever,
   parallelAll,
   repeat,
   spawn,
   wait,
} from "@/gameData/utils";
import { col } from "../common";

const shootInAll8Directions = (shootSpeed: number): TAction[] => [
   // blink to signal it's about to shoot
   { type: "gfxSetColor", color: "aqua" },
   { type: "wait", frames: 10 },
   { type: "gfxSetColor", color: "red" },
   { type: "wait", frames: 10 },

   { type: "setShotSpeed", pixelsPerFrame: shootSpeed },

   { type: "shootDirection", x: 1, y: -1 },
   { type: "shootDirection", x: 1, y: 0 },
   { type: "shootDirection", x: 1, y: 1 },
   { type: "shootDirection", x: 0, y: 1 },
   { type: "shootDirection", x: -1, y: 1 },
   { type: "shootDirection", x: -1, y: 0 },
   { type: "shootDirection", x: -1, y: -1 },
   { type: "shootDirection", x: 0, y: -1 },
];

const shotsAtPlayer: TAction[] = [
   repeat(4, [
      { type: "setShotSpeed", pixelsPerFrame: 0.9 },
      { type: "shoot_toward_player" }, 
      { type: "wait", frames: 70 }
   ]),

   repeat(10, [
      { type: "setShotSpeed", pixelsPerFrame: 1.0 },
      { type: "shoot_toward_player" }, 
      { type: "wait", frames: 28 }
   ]),

   repeat(16, [
      { type: "setShotSpeed", pixelsPerFrame: 1.1 },
      { type: "shoot_toward_player" }, 
      { type: "wait", frames: 8 }
   ]),

   forever(
      { type: "setShotSpeed", pixelsPerFrame: 1.1 },
      { type: "shoot_toward_player" }, 
      { type: "wait", frames: 8 }
   ),
];

const shootingPattern: TAction[] = [
   parallelAll(
      shotsAtPlayer,
      [
         wait(7 * 60),
         repeat(5, [
            ...shootInAll8Directions(0.8),
            { type: "wait", frames: 300 }
         ]),
         forever(
            ...shootInAll8Directions(0.8),
            { type: "wait", frames: 150 }
         ),
      ]
   )
];

const movePattern: TAction[] = [
   { type: "moveToAbsolute", frames: 60 * 7.5, moveTo: { x: col[5] }}
];

export const boss: IEnemyJson = {
   name: "boss",
   hp: 100_000, // immortal.
   diameter: 40,
   onDeathAction: spawn("bossCorpse"),
   actions: [
      { type: "gfxSetShape", shape: "stage2/circle.png" },
      ...movePattern,
      { type: "setAttribute", attribute: "hp", value: 70 }, // In fact make it immortal until now.
      parallelAll(
         shootingPattern
      )
   ]
};