/* eslint-disable import/no-default-export */
import type { TGame } from "@/gameTypes/TGame";

import { explosion, roundExplosion } from "./effects/explosions.ts";
import { kamikaze, kamikazeCorpse } from "./kamikaze/kamikazeCorpse.ts";
import { sinus } from "./kamikaze/sinus.ts";
import { pacifistStage } from "./pacifistStage.ts";
import { player } from "./player/player.ts";
import { playerLaser } from "./player/playerLaser.ts";
import { playerShot } from "./player/playerShot.ts";
import { shot } from "./shot.ts";
import { spawner } from "./spawner.ts";

import startScreen from "./startScreen.png";

const game: TGame = {
   name: "Some tests",

   startScreenImageUrl: startScreen,

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