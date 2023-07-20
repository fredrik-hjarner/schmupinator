/* eslint-disable import/no-default-export */
import type { TGame } from "@/gameTypes/TGame";

import { explosion, roundExplosion } from "./effects/explosions";
import { player } from "./player/player";
import { playerShot } from "./player/playerShot";
import { shot } from "./shot";
import { spawner } from "./spawner";
import { stage } from "./stage";
import { layer1, layer2, layer3, parallax } from "./parallax/parallax";
import { nonShootingAimer } from "./enemies/nonShootingAimer";
import { dot } from "./enemies/dot";
import { traceDot } from "./enemies/traceDot";
import { spinningDots } from "./enemies/spinningDots";
import { boss } from "./enemies/boss";
import { bossCorpse } from "./enemies/bossCorpse";

const game: TGame = [
   player,
   playerShot,
   parallax,
   layer1,
   layer2,
   layer3,

   // Stage 2
   explosion,
   roundExplosion,
   shot,
   spawner,
   stage,
   dot,
   traceDot,
   spinningDots,
   nonShootingAimer,
   boss,
   bossCorpse
];

export default game;