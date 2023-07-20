/* eslint-disable import/no-default-export */
import type { TGame } from "@/gameTypes/TGame";

import { explosion, roundExplosion } from "./effects/explosions";
import { kamikaze, kamikazeCorpse } from "./kamikaze/kamikazeCorpse";
import { sinus } from "./kamikaze/sinus";
import { pacifistStage } from "./pacifistStage";
import { player } from "./player/player";
import { playerLaser } from "./player/playerLaser";
import { playerShot } from "./player/playerShot";
import { shot } from "./shot";
import { spawner } from "./spawner";

const game: TGame = {
   gameObjects: [
      // Stage 1
      explosion,
      roundExplosion,
      kamikaze,
      kamikazeCorpse,
      sinus,
      pacifistStage,
      player,
      playerLaser,
      playerShot,
      shot,
      spawner,
   ]
};

export default game;