import type { IEnemyJson } from "../../../App/services/Enemies/enemyConfigs/IEnemyJson";
import type { TAction } from "@/App/services/Enemies/actions/actionTypes";

import {
   parallelAll,
   spawn,
   wait
} from "../../utils";


const explodeInAllDirections = (radius: number, _wait: number,): TAction[] => {
   return [
      // explosions in all directions
      spawn("roundExplosion", { x: -radius, y: 0 }),
      wait(_wait),
      wait(_wait),
      spawn("roundExplosion", { x: radius, y: 0 }),
      wait(_wait),
      spawn("roundExplosion", { x: 0, y: -radius }),
      wait(_wait),
      spawn("roundExplosion", { x: 0, y: radius }),
      spawn("roundExplosion", { x: -radius, y: -radius }),
      spawn("roundExplosion", { x: radius, y: radius }),
      wait(_wait),
      spawn("roundExplosion", { x: -radius, y: radius }),
      spawn("roundExplosion", { x: radius, y: -radius }),
   ];
};

export const bossCorpse: IEnemyJson = {
   name: "bossCorpse",
   diameter: 18,
   hp: 9999,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "explosion" },
      parallelAll(
         explodeInAllDirections(8, 3),
         explodeInAllDirections(24, 5),
         explodeInAllDirections(16, 15),
      ),
      { type: "wait", frames: 60 * 3 },
      { type: "finishLevel" }
   ],
};