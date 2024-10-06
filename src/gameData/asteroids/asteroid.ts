import type { TAction } from "../../App/services/Enemies/actions/actionTypes.ts";

import { ActionType as AT } from "../../App/services/Enemies/actions/actionTypes.ts";
import {
   attr,
   createGameObject,
   forever,
   fork,
   spawn,
   wait
} from "../utils/utils.ts";

/**
 * Screen wrap like in the real Asteroids game.
 * When the player goes outside the screen, it appears on the other side.
 */
const screenWrapActions: TAction[] = [
   fork(forever(
      // horizontal
      attr("x", { condition: "greaterThan", value: 357, yes: [
         { type: AT.setAttribute, attribute: "x", value: 0 },
      ] }),
      attr("x", { condition: "lessThan", value: 0, yes: [
         { type: AT.setAttribute, attribute: "x", value: 357 },
      ] }),

      // vertical
      attr("y", { condition: "greaterThan", value: 240, yes: [
         { type: AT.setAttribute, attribute: "y", value: 0 },
      ] }),

      attr("y", { condition: "lessThan", value: 0, yes: [
         { type: AT.setAttribute, attribute: "y", value: 240 },
      ] }),

      wait(1),
   )),
];

export const asteroid = createGameObject({
   name: "asteroid",
   diameter: 17,
   hp: 1,
   options: { despawnWhenOutsideScreen: false, defaultDirectionalControls: false },
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         spawn("smallAsteroid", {
            x: 2,
            y: -2,
            // move outward slownly
            actions: [
               fork({ type: AT.move, x: 100, y: -100, frames: 800 }),
            ]
         }),
         spawn("smallAsteroid", {
            x: -2,
            y: -2,
            // move outward slownly
            actions: [
               fork({ type: AT.move, x: -100, y: -100, frames: 800 }),
            ]
         }),
         spawn("smallAsteroid", {
            x: 0,
            y: 2,
            // move outward slownly
            actions: [
               fork({ type: AT.move, x: 0, y: 100, frames: 800 }),
            ]
         }),
         { type: AT.despawn },
      ),
      //set points to 0, otherwise you get points when the player dies since default is 10 currently
      { type: AT.setAttribute, attribute: "points", value: 0 },
      { type: AT.gfxSetColor, color: "red" },
      // TODO: setMoveDirection might be a stupid name for the
      // action and the way it works might also be stupid.
      // cuz every tick the gfx rotation is set to moveDirection,
      // which is contra-intuitive. Should prolly not be set
      // automaticallt on tick, but need to be set explicitly.
      { type: AT.setMoveDirection, degrees: 0 },
      { type: AT.setAttribute, attribute: "collisionType", value: "enemy" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      // The following line is just a hack to hide the player initially.
      { type: AT.gfxSetShape, shape: "none" },
      wait(1),
      { type: AT.gfxSetShape, shape: "diamondShield" },
      // setup screen wrapping
      ...screenWrapActions,
   ]
});

export const smallAsteroid = createGameObject({
   name: "smallAsteroid",
   diameter: 17,
   hp: 1,
   options: { despawnWhenOutsideScreen: false, defaultDirectionalControls: false },
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         // spawn even smaller fragments.
         { type: AT.despawn },
      ),
      //set points to 0, otherwise you get points when the player dies since default is 10 currently
      { type: AT.setAttribute, attribute: "points", value: 0 },
      { type: AT.gfxSetColor, color: "red" },
      // TODO: setMoveDirection might be a stupid name for the
      // action and the way it works might also be stupid.
      // cuz every tick the gfx rotation is set to moveDirection,
      // which is contra-intuitive. Should prolly not be set
      // automaticallt on tick, but need to be set explicitly.
      { type: AT.setMoveDirection, degrees: 0 },
      { type: AT.setAttribute, attribute: "collisionType", value: "enemy" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      // The following line is just a hack to hide the player initially.
      { type: AT.gfxSetShape, shape: "none" },
      wait(1),
      { type: AT.gfxSetShape, shape: "diamondShield" },
      // setup screen wrapping
      ...screenWrapActions,
   ]
});