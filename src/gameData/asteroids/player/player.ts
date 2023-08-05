import type { TAction } from "../../../App/services/Enemies/actions/actionTypes";

import { ActionType as AT } from "../../../App/services/Enemies/actions/actionTypes";
import { createGameObject, forever, fork, wait } from "../../utils/utils";

type TCreateShotArgs = { moveDeltaX: number, moveDeltaY: number };

const createShot = ({ moveDeltaX, moveDeltaY }: TCreateShotArgs): TAction => ({
   type: AT.spawn, enemy: "playerShot",
   actions: [
      fork(forever(
         { type: AT.moveDelta, x: moveDeltaX, y: moveDeltaY },
         { type: AT.waitNextFrame }
      ))
   ]
});

const trippleShot: TAction[] = [
   createShot({ moveDeltaX: 0, moveDeltaY: -9 }),
   createShot({ moveDeltaX: 1.5, moveDeltaY: -9 }),
   createShot({ moveDeltaX: -1.5, moveDeltaY: -9 }),
   wait(8),
];

const defaultDirectionalControlsActions: TAction[] = [
   fork(forever(
      { type: AT.waitForInput, pressed: ["left"] },
      { type: AT.decr, attribute: "moveDirectionAngle" },
      { type: AT.decr, attribute: "moveDirectionAngle" },
      { type: AT.decr, attribute: "moveDirectionAngle" },
      { type: AT.waitNextFrame },
   )),
   fork(forever(
      { type: AT.waitForInput, pressed: ["right"] },
      { type: AT.incr, attribute: "moveDirectionAngle" },
      { type: AT.incr, attribute: "moveDirectionAngle" },
      { type: AT.incr, attribute: "moveDirectionAngle" },
      { type: AT.waitNextFrame },
   )),
   fork(forever(
      { type: AT.waitForInput, pressed: ["up"] },
      { type: AT.move_according_to_speed_and_direction },
      { type: AT.waitNextFrame },
   )),
   fork(forever(
      { type: AT.waitForInput, pressed: ["down"] },
      { type: AT.moveDelta, y: 2.35 },
      { type: AT.waitNextFrame },
   )),
];

export const player = createGameObject({
   name: "player",
   diameter: 20,
   hp: 1,
   onDeathAction: { type: AT.finishLevel }, // TODO: finishLevel should maybe be called gameOver.
   options: { despawnWhenOutsideScreen: false, defaultDirectionalControls: false },
   actions: [
      //set points to 0, otherwise you get points when the player dies since default is 10 currently
      { type: AT.setAttribute, attribute: "points", value: 0 },
      { type: AT.gfxSetColor, color: "aqua" },
      // TODO: setMoveDirection might be a stupid name for the
      // action and the way it works might also be stupid.
      // cuz every tick the gfx rotation is set to moveDirection,
      // which is contra-intuitive. Should prolly not be set
      // automaticallt on tick, but need to be set explicitly.
      { type: AT.setMoveDirection, degrees: 0 },
      { type: AT.setAttribute, attribute: "collisionType", value: "player" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: true },
      // The following line is just a hack to hide the player initially.
      { type: AT.gfxSetShape, shape: "none" },
      wait(1),
      { type: AT.gfxSetShape, shape: "diamondShield" },
      fork(forever(
         { type: AT.waitForInput, pressed: ["shoot"], notPressed: ["laser"] },
         ...trippleShot,
      )),
      { type: AT.setSpeed, pixelsPerFrame: 0.9 },
      ...defaultDirectionalControlsActions,
   ]
});