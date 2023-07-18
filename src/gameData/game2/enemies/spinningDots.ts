import type { IEnemyJson } from "@/App/services/Enemies/enemyConfigs/IEnemyJson";
import type { TAction } from "@/App/services/Enemies/actions/actionTypes";

import {
   forever,
   fork,
   spawn,
} from "@/gameData/utils";

const dist = 27;

const rotate = ({ x, y }: { x?: number, y?: number }): TAction => ({
   type: "rotate_around_relative_point",
   degrees: -360 * 15,
   frames: 200 * 4.0 * 15,
   point: { x, y }
});

export const spinningDots: IEnemyJson = {
   name: "spinningDots",
   hp: 9999,
   diameter: 5,
   onDeathAction: spawn("roundExplosion"),
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "none" },
      { type: "gfxSetShape", shape: "stage2/circle.png" },
      { type: "gfxSetColor", color: "aqua" },
      // center
      spawn("dot", {
         actions: [
            fork(forever(
               { type: "moveDelta", x: -0.55 },
               { type: "waitNextFrame" },
            )),
         ]
      }),

      // in-right
      spawn("dot", {
         x: dist,
         actions: [
            fork(forever(
               { type: "moveDelta", x: -0.55 },
               { type: "waitNextFrame" },
            )),
            fork(rotate({ x: -dist }))
         ]
      }),
      // out-right
      spawn("dot", {
         x: dist*2,
         actions: [
            fork(forever(
               { type: "moveDelta", x: -0.55 },
               { type: "waitNextFrame" },
            )),
            fork(rotate({ x: -(dist*2) }))]
      }),

      // in-left
      spawn("dot", {
         x: -dist,
         actions: [
            fork(forever(
               { type: "moveDelta", x: -0.55 },
               { type: "waitNextFrame" },
            )),
            fork(rotate({ x: dist }))]
      }),
      // out-left
      spawn("dot", {
         x: -(dist*2),
         actions: [
            fork(forever(
               { type: "moveDelta", x: -0.55 },
               { type: "waitNextFrame" },
            )),
            fork(rotate({ x: dist*2 }))]
      }),
      { type: "despawn" }
   ]
};