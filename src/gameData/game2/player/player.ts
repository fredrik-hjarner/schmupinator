import type { IEnemyJson } from "../../../gameTypes/IEnemyJson";
import type { TAction } from "../../../App/services/Enemies/actions/actionTypes";

import { ActionType as AT } from "../../../App/services/Enemies/actions/actionTypes";
import { forever, fork, wait } from "../../utils";

type TCreateShotArgs = { moveDeltaX: number, moveDeltaY: number };

const createShot = ({ moveDeltaX, moveDeltaY }: TCreateShotArgs): TAction => ({
   type: AT.spawn,
   enemy: "playerShot",
   actions: [
      fork(forever(
         { type: AT.moveDelta, x: moveDeltaX, y: moveDeltaY },
         { type: AT.waitNextFrame }
      ))
   ]
});

const trippleShot: TAction[] = [
   createShot({ moveDeltaY: 0, moveDeltaX: 9 }),
   wait(8),
];

export const player: IEnemyJson = {
   name: "player",
   diameter: 20,
   hp: 1,
   actions: [
      //set points to 0, otherwise you get points when the player dies since default is 10 currently
      { type: AT.setAttribute, attribute: "points", value: 0 },
      { type: "gfxSetColor", color: "aqua" },
      // TODO: setMoveDirection might be a stupid name for the
      // action and the way it works might also be stupid.
      // cuz every tick the gfx rotation is set to moveDirection,
      // which is contra-intuitive. Should prolly not be set
      // automaticallt on tick, but need to be set explicitly.
      { type: AT.setMoveDirection, degrees: 0 },
      { type: AT.setAttribute, attribute: "collisionType", value: "player" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: true },
      // The following line is just a hack to hide the player initially.
      { type: "gfxSetShape", shape: "none" },
      { type: AT.setMoveDirection, degrees: 90 },
      wait(1),
      { type: "gfxSetShape", shape: "stage2/player.png" },
      fork(forever(
         { type: AT.moveAccordingToInput },
         { type: AT.waitNextFrame }
      )),
      fork(forever(
         { type: AT.waitInputShoot },
         ...trippleShot,
      )),
   ]
};