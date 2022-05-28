import type { Action } from "../../actionTypes";

const enemyShotSpeed = 2.8;

const diagonalSpd = enemyShotSpeed/Math.SQRT2;

export const firstMiniBossShootActions: Action[] = [
  // { type: "set_shot_speed", pixelsPerFrame: enemyShotSpeed },
  { type: 'wait', frames: 25 },
  { type: "repeat", times: 9999, actions: [
    // beam
    { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
    { type: 'wait', frames: 3 },
    { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
    { type: 'wait', frames: 3 },
    { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
    { type: 'wait', frames: 64 - 3 - 3 },
    // triplets
    { type: "repeat", times: 2, actions: [
      { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
      { type: 'shoot_direction', dirX: -diagonalSpd, dirY: diagonalSpd },
      { type: 'shoot_direction', dirX: diagonalSpd, dirY: diagonalSpd },
      { type: 'wait', frames: 64 },
    ]}
  ]}
];
