import type { TAction, TMove } from "../../../App/services/Enemies/actions/actionTypes";
import type { TGameObject } from "../../../gameTypes/TGameObject";

import { ActionType as AT } from "../../../App/services/Enemies/actions/actionTypes";
import { Do, attr, createGameObject, parallelAll, twice, wait } from "../../utils/utils";

const moveLeft: TMove = {
   type: AT.move,
   frames: 80,
   x: -205,
   y: 30,
};

const moveRight: TMove = {
   ...moveLeft,
   x: 205,
};

const rotateLeft: TAction = {
   type: AT.rotate_around_relative_point,
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
   { type: AT.shootTowardPlayer },
];

const rotateLeftAndShoot = parallelAll(
   rotateLeft,
   shootWhileRotation
);

const rotateRightAndShoot = parallelAll(
   rotateRight,
   shootWhileRotation
);

export const sinus: TGameObject = createGameObject({
   name: "sinus",
   hp: 1,
   diameter: 24,
   onDeathAction: Do(
      { type: AT.spawn, enemy: "roundExplosion" },
      { type: AT.spawn, enemy: "kamikazeCorpse" },
   ),
   actions: [
      { type: AT.gfxSetShape, shape: "octagon" },
      { type: AT.setShotSpeed, pixelsPerFrame: 1.5 },
      attr("right", { value: true, yes: [{ type: AT.mirrorX, value: true }] }),
      twice(
         rotateLeftAndShoot,
         moveRight,
         rotateRightAndShoot,
         moveLeft,
      )
   ],
});