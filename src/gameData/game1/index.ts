/* eslint-disable import/no-default-export */
import type { IEnemyJson } from "../../App/services/Enemies/enemyConfigs/IEnemyJson";

import { explosion, roundExplosion } from "./effects/explosions";
import { player } from "./player/player";
import { playerLaser } from "./player/playerLaser";
import { playerShot } from "./player/playerShot";
import { shot } from "./shot";
import { spawner } from "./spawner";
import { firstMiniboss, nonShootingAimer, sinus, stage1 } from "./stage1";
import { cloner, clonerChild, stage2 } from "./stage2";
import { dehealer, healer, shapeShifter, stage3 } from "./stage3";
import { easyFlyer, stage4 } from "./stage4";

const game: IEnemyJson[] = [
   // Stage 1
   explosion,
   roundExplosion,
   player,
   playerLaser,
   playerShot,
   shot,
   spawner,
   stage1,
   nonShootingAimer,
   sinus,
   firstMiniboss,

   // Stage 2
   stage2,
   cloner,
   clonerChild,

   // Stage 3
   stage3,
   shapeShifter,
   healer,
   dehealer,

   // Stage 4
   stage4,
   easyFlyer,
];

export default game;