import type { Action } from "../actionTypes.js";

import { enemyShotSpeed } from "../../../../../consts.js";

export const firstMiniBossShootActions: Action[] = [
  // beam
  { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
  { type: 'wait', frames: 3 },
  { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
  { type: 'wait', frames: 3 },
  { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
  { type: 'wait', frames: 64 - 3 - 3 },
  // triplet
  { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
  { type: 'shoot_direction', dirX: -enemyShotSpeed/Math.SQRT2, dirY: enemyShotSpeed/Math.SQRT2 },
  { type: 'shoot_direction', dirX: enemyShotSpeed/Math.SQRT2, dirY: enemyShotSpeed/Math.SQRT2 },
  { type: 'wait', frames: 64 },
  // triplet
  { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
  { type: 'shoot_direction', dirX: -enemyShotSpeed/Math.SQRT2, dirY: enemyShotSpeed/Math.SQRT2 },
  { type: 'shoot_direction', dirX: enemyShotSpeed/Math.SQRT2, dirY: enemyShotSpeed/Math.SQRT2 },
  { type: 'wait', frames: 64 },
  // TODO: !!!!!
  // { type: "repeat", times: 2, actions: [
  //   { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
  //   {type:'shoot_direction', dirX: -enemyShotSpeed/Math.SQRT2, dirY: enemyShotSpeed/Math.SQRT2 },
  //   {type:'shoot_direction', dirX: enemyShotSpeed/Math.SQRT2, dirY: enemyShotSpeed/Math.SQRT2 },
  //   { type: 'wait', frames: 64 },
  // ]}
];
