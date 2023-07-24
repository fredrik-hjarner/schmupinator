import type { TGameObject } from "@/gameTypes/TGameObject";

import {
   createGameObject, forever, parallelAll, repeat, setSpeed, spawn, wait
} from "@/gameData/utils";
import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";

export const nonShootingAimer: TGameObject = createGameObject({
   name: "nonShootingAimer",
   hp: 1,
   diameter: 22,
   onDeathAction: spawn("roundExplosion"),
   actions: [
      setSpeed(1.6),
      parallelAll(
         repeat(26.25, [
            { type: AT.rotate_towards_player },
            wait(8)
         ]),
         forever(
            { type: AT.move_according_to_speed_and_direction },
            { type: AT.waitNextFrame }
         )
      )
   ]
});