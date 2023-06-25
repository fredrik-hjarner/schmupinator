import type { TAction, TMove } from "../../../App/services/Enemies/actions/actionTypes";
import type { IEnemyJson } from "../../../App/services/Enemies/enemyConfigs/IEnemyJson";

import { Do, attr, parallelAll, twice, wait } from "../../utils";

const moveLeft: TMove = {
   type: "move",
   frames: 80,
   x: -205,
   y: 30,
};

const moveRight: TMove = {
   ...moveLeft,
   x: 205,
};

const rotateLeft: TAction = {
   type: "rotate_around_relative_point",
   degrees: -180,
   frames: 35,
   point: { y: 31 },
};

const rotateRight = {
   ...rotateLeft,
   degrees: 180,
};

const shootWhileRotation: TAction[] = [
   wait(16),
   { type: "shoot_toward_player" },
];

const rotateLeftAndShoot = parallelAll(
   rotateLeft,
   shootWhileRotation
);

const rotateRightAndShoot = parallelAll(
   rotateRight,
   shootWhileRotation
);

export const sinus: IEnemyJson = {
   name: "sinus",
   hp: 1,
   diameter: 24,
   onDeathAction: Do(
      { type: "spawn", enemy: "roundExplosion" },
      { type: "spawn", enemy: "kamikazeCorpse" },
   ),
   actions: [
      { type: "gfxSetShape", shape: "octagon" },
      { type: "setShotSpeed", pixelsPerFrame: 1.5 },
      attr("right", { is: true, yes: [{ type: "mirrorX", value: true }] }),
      twice(
         rotateLeftAndShoot,
         moveRight,
         rotateRightAndShoot,
         moveLeft,
      )
   ],
};