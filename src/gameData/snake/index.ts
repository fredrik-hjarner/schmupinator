/* eslint-disable import/no-default-export */
import type { TGame } from "@/gameTypes/TGame";

import { explosion, roundExplosion } from "../utils/effects.ts";
import { player } from "./player/player.ts";
import { spawner } from "./spawner.ts";
import { layer1, layer2, layer3, parallax } from "./parallax/parallax.ts";
import { snakeBody } from "./player/snakeBody.ts";
import { appleSpawner } from "./apples/appleSpawner.ts";
import { apple } from "./apples/apple.ts";
import { IsBrowser } from "@/drivers/BrowserDriver/IsBrowser.ts";

const startScreen: string = IsBrowser() ? (await import("./startScreen.png")).default : "";

const game: TGame = {
   name: "4. Snake",

   startScreenImageUrl: startScreen,

   gameObjects: [
      player,
      snakeBody,
      appleSpawner,
      apple,
      parallax,
      layer1,
      layer2,
      layer3,
      explosion,
      roundExplosion,

      spawner,
   ]
};

export default game;