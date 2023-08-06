/* eslint-disable import/no-default-export */
import type { TGame } from "@/gameTypes/TGame";

import { explosion, roundExplosion } from "../utils/effects";
import { player } from "./player/player";
import { shot } from "./shot";
import { spawner } from "./spawner";
import { layer1, layer2, layer3, parallax } from "./parallax/parallax";
import startScreen from "./startScreen.png";
import { snakeBody } from "./player/snakeBody";

const game: TGame = {
   name: "4. Snake",

   startScreenImageUrl: startScreen,

   gameObjects: [
      player,
      snakeBody,
      parallax,
      layer1,
      layer2,
      layer3,
      explosion,
      roundExplosion,
      shot,

      spawner,
   ]
};

export default game;