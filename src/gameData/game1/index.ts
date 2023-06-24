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
   // @ts-ignore
   stage2,
   // @ts-ignore
   cloner,
   // @ts-ignore
   clonerChild,

   // Stage 3
   // @ts-ignore
   stage3,
   // @ts-ignore
   shapeShifter,
   // @ts-ignore
   healer,
   // @ts-ignore
   dehealer,

   // Stage 4
   // @ts-ignore
   stage4,
   // @ts-ignore
   easyFlyer,
];

export default game;