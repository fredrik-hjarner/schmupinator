/* eslint-disable import/no-default-export */
import type { TGame } from "@/gameTypes/TGame";

import { explosion, roundExplosion } from "./effects/explosions.ts";
import { player } from "./player/player.ts";
import { playerShot } from "./player/playerShot.ts";
import { shot } from "./shot.ts";
import { spawner } from "./spawner.ts";
import { stage } from "./stage.ts";
import { layer1, layer2, layer3, parallax } from "./parallax/parallax.ts";
import { nonShootingAimer } from "./enemies/nonShootingAimer.ts";
import { dot } from "./enemies/dot.ts";
import { traceDot } from "./enemies/traceDot.ts";
import { spinningDots } from "./enemies/spinningDots.ts";
import { boss } from "./enemies/boss.ts";
import { bossCorpse } from "./enemies/bossCorpse.ts";
import { IsBrowser } from "@/drivers/BrowserDriver/IsBrowser.ts";

const startScreen: string = IsBrowser() ? (await import("./startScreen.png")).default : "";

const game: TGame = {
   name: "2. Horizontal level",

   startScreenImageUrl: startScreen,

   gameObjects: [
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
   ]
};

export default game;