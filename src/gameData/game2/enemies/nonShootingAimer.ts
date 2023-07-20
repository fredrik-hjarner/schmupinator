import type { IEnemyJson } from "@/gameTypes/IEnemyJson";

import { forever, parallelAll, repeat, setSpeed, spawn, wait } from "@/gameData/utils";

export const nonShootingAimer: IEnemyJson = {
   name: "nonShootingAimer",
   hp: 1,
   diameter: 22,
   onDeathAction: spawn("roundExplosion"),
   actions: [
      setSpeed(1.6),
      parallelAll(
         repeat(26.25, [
            { type: "rotate_towards_player" },
            wait(8)
         ]),
         forever(
            { type: "move_according_to_speed_and_direction" },
            { type: "waitNextFrame" }
         )
      )
   ]
};