/* eslint-disable max-len */
import type { IEnemyJson } from "../../App/services/Enemies/enemyConfigs/IEnemyJson";
import type { TAction } from "../../App/services/Enemies/actions/actionTypes";
import type { TShortFormAction } from "../../App/services/Enemies/actions/actionTypesShortForms";

import { spawn, wait } from "../utils";

const aimerLeft = spawn("nonShootingAimer", { x: 128.5, y: -22 });
const aimerRight = spawn("nonShootingAimer", { x: 228.5, y: -22 });

const sinusLeft = spawn("sinus", { x: 75, y: -20 });
const sinusRight = spawn("sinus", {
   x: 280,
   y: -20,
   actions: [{ type: "setAttribute", attribute: "right", value: true }]
});

const leftMiniBoss = spawn("firstMiniboss", { x: 118.881, y: -20 });
const rightMiniBoss = spawn("firstMiniboss", {
   x: 237.762,
   y: -20,
   actions: [{ type: "setAttribute", attribute: "right", value: true }]
});

const aimers = [{
   repeat: 8,
   actions: [aimerLeft, aimerRight, wait(40)]
}];

const sinuses = [{
   repeat: 5,
   actions: [
      sinusLeft,  wait(70),
      sinusRight, wait(70),
   ]
}];

export const stage1: IEnemyJson = {
   name: "stage1",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "none" },
      wait(120),
      // @ts-ignore
      ...aimers,
      // @ts-ignore
      wait(120),
      // @ts-ignore
      ...sinuses,
      // @ts-ignore
      wait(200),
      // @ts-ignore
      // leftMiniBoss,
      // @ts-ignore
      // rightMiniBoss,
      leftMiniBoss,
      // @ts-ignore
      rightMiniBoss,
   ]
};

//------------------------------------------------------------

export const nonShootingAimer: IEnemyJson = {
   name: "nonShootingAimer",
   hp: 4,
   diameter: 22,
   // @ts-ignore
   onDeathAction: spawn("roundExplosion"),
   actions: [
      { setSpeed: 1.6 },
      {
         parallelAll: [
            [{
               // @ts-ignore
               repeat: 26.25,
               actions: [
                  // @ts-ignore
                  { type: "rotate_towards_player" },
                  // @ts-ignore
                  wait(8)
               ]
            }],
            [{
               // @ts-ignore
               forever: [
                  // @ts-ignore
                  { type: "move_according_to_speed_and_direction" },
                  // @ts-ignore
                  { type: "waitNextFrame" }
               ]
            }]
         ]
      }
   ]
};

//------------------------------------------------------------

const moveLeft = { type: "move", frames: 80, x: -205, y: 30 };
const moveRight = { ...moveLeft, x: 205 };

const rotateLeft: TAction | TShortFormAction = {
   type: "rotate_around_relative_point",
   degrees: -180,
   frames: 35,
   point: { y: 31 }
};
const rotateRight: TAction | TShortFormAction = { ...rotateLeft, degrees: 180 };

const shootWhileRotation: (TAction | TShortFormAction)[] = [
   wait(16),
   { type: "shoot_toward_player" }
];

const rotateLeftAndShoot = {
   parallelAll: [[rotateLeft], shootWhileRotation]
};

const rotateRightAndShoot: TAction | TShortFormAction = {
   // @ts-ignore
   parallelAll: [[rotateRight], shootWhileRotation]
};

export const sinus: IEnemyJson = {
   name: "sinus",
   hp: 3,
   diameter: 24,
   // @ts-ignore
   onDeathAction: spawn("roundExplosion"),
   actions: [
      { setShotSpeed: 2 },
      // @ts-ignore
      { attr: "right", is: true, yes: [{ type: "mirrorX", value: true }] },
      {
         twice: [ // TODO: remove `twice` from core game code and let it be a "util"
            // @ts-ignore
            rotateLeftAndShoot, 
            // @ts-ignore
            moveRight,
            // @ts-ignore
            rotateRightAndShoot,
            // @ts-ignore
            moveLeft
         ]
      }
   ]
};

//------------------------------------------------------------

const shootDown = { type: "shootDirection", x: 0, y: 1 };

const shootingPattern = [
   wait(75),
   {
      forever: [
         { setShotSpeed: 2.6 },
         { thrice: [shootDown, wait(3)] }, // TODO: replace with { repeat: 3, actions: ... }
         wait(55),
         { setShotSpeed: 2.2 },
         {
            twice: [ // TODO: replace with { repeat: 2, actions: ... }
               { type: "shoot_toward_player" },
               { type: "shoot_beside_player", degrees: 25 },
               { type: "shoot_beside_player", degrees: -25 },
               wait(64)
            ]
         }
      ]
   }
];

const intoScreen =            { moveToAbsolute: { x: 116, y: 0 }, frames: 40 };
const down1 =                 { moveToAbsolute: { y: 75 }, frames: 52 };
const quarterCircleDownIn =   { type: "rotate_around_relative_point", degrees: -90, frames: 39, point: { x: 25, y: -5 } };
const quarterCircleDownOut =  { type: "rotate_around_relative_point", degrees: 90, frames: 39, point: { x: -20, y: -11 } };
const in1 =                   { moveToAbsolute: { x: 139.5 }, frames: 47};
const up1 =                   { moveToAbsolute: { y: 11 }, frames: 100 };
const halfCircleLeftDown =    { type: "rotate_around_absolute_point", point: { y: 61 }, degrees: -180, frames: 100 };
const out1 =                  { moveToAbsolute: { x: 99.5 }, frames: 50 };
const down2 =                 { moveToAbsolute: { y: 141 }, frames: 30 };
const up2 =                   { moveToAbsolute: { y: 61 }, frames: 80 };
const downIn =                { moveToAbsolute: { x: 138.5, y: 105 }, frames: 40 };
const rotateClockwise =       { type: "rotate_around_absolute_point", point: { x: 178.5 }, degrees: 360, frames: 240 };
const rotateAntiClockwise =   { type: "rotate_around_absolute_point", point: { x: 178.5 }, degrees: -360, frames: 240 };
const downOutOfScreen =       { moveToAbsolute: { x: 98.5, y: 290 }, frames: 210 };

const movementPattern = [
   { attr: "right", is: true, yes: [{ type: "mirrorX", value: true }] },
   intoScreen,
   down1,

   quarterCircleDownIn,  wait(25),
   quarterCircleDownOut, wait(25),
   in1,                  wait(25),
   up1,                  wait(25),
   halfCircleLeftDown,   wait(25),
   out1,                 wait(25),
   down2,                wait(25),
   up2,                  wait(25),
   downIn,               wait(25),

   { attr: "right", is: true, yes: [{ type: "mirrorY", value: true }] },
   rotateClockwise,      wait(25),
   rotateAntiClockwise,
   { attr: "right", is: true, yes: [{ type: "mirrorY", value: false }] },
   wait(25),
   downOutOfScreen
];

export const firstMiniboss: IEnemyJson = {
   name: "firstMiniboss",
   hp: 120,
   diameter: 35,
   actions: [{
      parallelRace: [
         // @ts-ignore
         shootingPattern,
         // @ts-ignore
         movementPattern
      ]
   }]
};
