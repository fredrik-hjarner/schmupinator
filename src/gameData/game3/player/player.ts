import type { IEnemyJson } from "../../../gameTypes/IEnemyJson";
import type { TAction } from "../../../App/services/Enemies/actions/actionTypes";

import { forever, fork, wait } from "../../utils";

type TCreateShotArgs = { moveDeltaX: number, moveDeltaY: number };

const createShot = ({ moveDeltaX, moveDeltaY }: TCreateShotArgs): TAction => ({
   type: "spawn", enemy: "playerShot",
   actions: [
      fork(forever(
         { type: "moveDelta", x: moveDeltaX, y: moveDeltaY },
         { type: "waitNextFrame" }
      ))
   ]
});

const trippleShot: TAction[] = [
   createShot({ moveDeltaX: 0, moveDeltaY: -9 }),
   createShot({ moveDeltaX: 1.5, moveDeltaY: -9 }),
   createShot({ moveDeltaX: -1.5, moveDeltaY: -9 }),
   wait(8),
];

const laser: TAction[] = [
   { type: "spawn", enemy: "playerLaser", y: 15 },
   { type: "spawn", enemy: "playerLaser", y: 10 },
   { type: "spawn", enemy: "playerLaser", y: 5 },
   { type: "spawn", enemy: "playerLaser", y: 0 },
   { type: "spawn", enemy: "playerLaser", y: -5 },
   { type: "spawn", enemy: "playerLaser", y: -10 },
   wait(3),
];

export const player: IEnemyJson = {
   name: "player",
   diameter: 20,
   hp: 1,
   actions: [
      //set points to 0, otherwise you get points when the player dies since default is 10 currently
      { type: "setAttribute", attribute: "points", value: 0 },
      { type: "gfxSetColor", color: "aqua" },
      // TODO: setMoveDirection might be a stupid name for the
      // action and the way it works might also be stupid.
      // cuz every tick the gfx rotation is set to moveDirection,
      // which is contra-intuitive. Should prolly not be set
      // automaticallt on tick, but need to be set explicitly.
      { type: "setMoveDirection", degrees: 0 },
      { type: "setAttribute", attribute: "collisionType", value: "player" },
      { type: "setAttribute", attribute: "boundToWindow", value: true },
      // The following line is just a hack to hide the player initially.
      { type: "gfxSetShape", shape: "none" },
      wait(1),
      { type: "gfxSetShape", shape: "diamondShield" },
      fork(forever(
         { type: "moveAccordingToInput" },
         { type: "waitNextFrame" }
      )),
      fork(forever(
         { type: "waitInputShoot" },
         ...trippleShot,
      )),
      fork(forever(
         { type: "waitInputLaser" },
         ...laser,
      )),
   ]
};