/* eslint-disable import/no-default-export */
import type { IEnemyJson } from "@/App/services/Enemies/enemyConfigs/IEnemyJson";

import { explosion, roundExplosion } from "./effects/explosions";
import { player } from "./player/player";
import { playerLaser } from "./player/playerLaser";
import { playerShot } from "./player/playerShot";
import { shot } from "./shot";
import { spawner } from "./spawner";
import { stage1 } from "./stage1";
import { layer1, layer2, layer3, parallax } from "./parallax/parallax";
import { nonShootingAimer } from "./enemies/nonShootingAimer";
import { dot } from "./enemies/dot";
import { traceDot } from "./enemies/traceDot";
import { spinningDots } from "./enemies/spinningDots";

const game: IEnemyJson[] = [
   player,
   playerLaser,
   playerShot,
   parallax,
   layer1,
   layer2,
   layer3,

   // Stage 1
   explosion,
   roundExplosion,
   shot,
   spawner,
   stage1,
   dot,
   traceDot,
   spinningDots,
   nonShootingAimer,
];

export default game;