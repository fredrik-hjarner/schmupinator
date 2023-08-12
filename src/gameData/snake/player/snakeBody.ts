import { ActionType as AT } from "../../../App/services/Enemies/actions/actionTypes.ts";
import {
   createGameObject,
   wait
} from "../../utils/utils.ts";

export const snakeBody = createGameObject({
   name: "snakeBody",
   diameter: 17,
   hp: 1,
   // onDeathAction: { type: AT.finishLevel }, // TODO: finishLevel should maybe be called gameOver.
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
      { type: AT.setMoveDirection, degrees: 90 },
      { type: AT.setAttribute, attribute: "collisionType", value: "player" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      // The following line is just a hack to hide the player initially.
      { type: AT.gfxSetShape, shape: "none" },
      wait(1),
      { type: AT.gfxSetShape, shape: "circle" },
      { type: AT.incr, attribute: "speed", amount: 0 },
      wait(60 * 3),
      { type: AT.despawn },
   ]
});