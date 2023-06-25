/* eslint-disable max-len */
import type { IEnemyJson } from "../../App/services/Enemies/enemyConfigs/IEnemyJson";
import type {
   TAction, TMove, TShootDirection
} from "../../App/services/Enemies/actions/actionTypes";

import {
   attr, forever, moveToAbsolute, parallelAll, parallelRace,
   repeat, setShotSpeed, setSpeed, spawn, thrice, twice, wait
} from "../utils";

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

const aimers = repeat(8, [
   aimerLeft,
   aimerRight,
   wait(40)
]);

const sinuses = repeat(5, [
   sinusLeft,
   wait(70),
   sinusRight,
   wait(70),
]);

export const stage1: IEnemyJson = {
   name: "stage1",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "none" },
      { type: "gfxSetShape", shape: "none" },
      wait(120),
      aimers,
      wait(120),
      sinuses,
      wait(200),
      // leftMiniBoss,
      // rightMiniBoss,
      leftMiniBoss,
      rightMiniBoss,
   ]
};

//------------------------------------------------------------

export const nonShootingAimer: IEnemyJson = {
   name: "nonShootingAimer",
   hp: 4,
   diameter: 22,
   onDeathAction: spawn("roundExplosion"),
   actions: [
      setSpeed(1.6),
      parallelAll(
         repeat(26.25, [
            { type: "rotate_towards_player" },
            wait(8)
         ]),
         forever(
            { type: "move_according_to_speed_and_direction" },
            { type: "waitNextFrame" }
         )
      )
   ]
};

//------------------------------------------------------------

const moveLeft: TMove = { type: "move", frames: 80, x: -205, y: 30 };
const moveRight: TMove = { ...moveLeft, x: 205 };

const rotateLeft: TAction = {
   type: "rotate_around_relative_point",
   degrees: -180,
   frames: 35,
   point: { y: 31 }
};
const rotateRight: TAction = { ...rotateLeft, degrees: 180 };

const shootWhileRotation: TAction[] = [
   wait(16),
   { type: "shoot_toward_player" }
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
   hp: 3,
   diameter: 24,
   onDeathAction: spawn("roundExplosion"),
   actions: [
      setShotSpeed(2),
      attr("right", { is: true, yes: [{ type: "mirrorX", value: true }] }),
      twice(
         rotateLeftAndShoot, 
         moveRight,
         rotateRightAndShoot,
         moveLeft
      )
   ]
};

//------------------------------------------------------------

const shootDown: TShootDirection = { type: "shootDirection", x: 0, y: 1 };

const shootingPattern = [
   wait(75),
   forever(
      setShotSpeed(2.6),
      thrice(
         shootDown,
         wait(3)
      ),
      wait(55),
      setShotSpeed(2.2),
      twice(
         { type: "shoot_toward_player" },
         { type: "shoot_beside_player", degrees: 25 },
         { type: "shoot_beside_player", degrees: -25 },
         wait(64)
      )
   )
];

const intoScreen: TAction =            moveToAbsolute({ x: 116, y: 0 , frames: 40 });
const down1: TAction =                 moveToAbsolute({ y: 75 , frames: 52 });
const quarterCircleDownIn: TAction =   { type: "rotate_around_relative_point", degrees: -90, frames: 39, point: { x: 25, y: -5 } };
const quarterCircleDownOut: TAction =  { type: "rotate_around_relative_point", degrees: 90, frames: 39, point: { x: -20, y: -11 } };
const in1: TAction =                   moveToAbsolute({ x: 139.5 , frames: 47});
const up1: TAction =                   moveToAbsolute({ y: 11 , frames: 100 });
const halfCircleLeftDown: TAction =    { type: "rotate_around_absolute_point", point: { y: 61 }, degrees: -180, frames: 100 };
const out1: TAction =                  moveToAbsolute({ x: 99.5, frames: 50 });
const down2: TAction =                 moveToAbsolute({ y: 141, frames: 30 });
const up2: TAction =                   moveToAbsolute({ y: 61, frames: 80 });
const downIn: TAction =                moveToAbsolute({ x: 138.5, y: 105, frames: 40 });
const rotateClockwise: TAction =       { type: "rotate_around_absolute_point", point: { x: 178.5 }, degrees: 360, frames: 240 };
const rotateAntiClockwise: TAction =   { type: "rotate_around_absolute_point", point: { x: 178.5 }, degrees: -360, frames: 240 };
const downOutOfScreen: TAction =       moveToAbsolute({ x: 98.5, y: 290, frames: 210 });

const movementPattern: TAction[] = [
   attr("right", { is: true, yes: [{ type: "mirrorX", value: true }] }),
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

   attr("right", { is: true, yes: [{ type: "mirrorY", value: true }] }),
   rotateClockwise,      wait(25),
   rotateAntiClockwise,
   attr("right", { is: true, yes: [{ type: "mirrorY", value: false }] }),
   wait(25),
   downOutOfScreen
];

export const firstMiniboss: IEnemyJson = {
   name: "firstMiniboss",
   hp: 120,
   diameter: 35,
   actions: [
      parallelRace(
         shootingPattern,
         movementPattern
      )
   ]
};
