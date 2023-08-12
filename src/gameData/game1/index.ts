/* eslint-disable import/no-default-export */
import type { TGame } from "@/gameTypes/TGame";

import { explosion, roundExplosion } from "./effects/explosions.ts";
import { player } from "./player/player.ts";
import { playerLaser } from "./player/playerLaser.ts";
import { playerShot } from "./player/playerShot.ts";
import { shot } from "./shot.ts";
import { spawner } from "./spawner.ts";
import { firstMiniboss, nonShootingAimer, sinus, stage1 } from "./stage1.ts";
import { cloner, clonerChild, stage2 } from "./stage2.ts";
import { dehealer, healer, shapeShifter, stage3 } from "./stage3.ts";
import { easyFlyer, stage4 } from "./stage4.ts";
import { layer1, layer2, layer3, parallax } from "./parallax/parallax.ts";
import { aqua, child, executor, parent, repeatFromHp, shotSpeedFromHp, stage5 } from "./stage5.ts";
import { IsBrowser } from "@/drivers/BrowserDriver/IsBrowser.ts";

const startScreen: string = IsBrowser() ? (await import("./startScreen.png")).default : "";

const game: TGame = {
   name: "1. Vertical level",

   startScreenImageUrl: startScreen,

   gameObjects: [
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

      // Stage 5
      stage5,
      executor,
      aqua,
      shotSpeedFromHp,
      repeatFromHp,
      child,
      parent,
   ]
};

export default game;