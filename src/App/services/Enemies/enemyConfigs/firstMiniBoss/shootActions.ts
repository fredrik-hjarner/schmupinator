import type { Action } from "../../actionTypes";

const enemyShotSpeed = 2.8;

export const firstMiniBossShootActions: Action[] = [
  { type: "set_shot_speed", pixelsPerFrame: enemyShotSpeed },
  { type: 'wait', frames: 45 },
  { type: "repeat", times: 9999, actions: [
    // beam
    { type: 'shoot_direction', dirX: 0, dirY: 1 },
    { type: 'wait', frames: 3 },
    { type: 'shoot_direction', dirX: 0, dirY: 1 },
    { type: 'wait', frames: 3 },
    { type: 'shoot_direction', dirX: 0, dirY: 1 },
    { type: 'wait', frames: 64 - 3 - 3 },
    // triplets
    { type: "repeat", times: 2, actions: [
      // { type: 'shoot_direction', dirX: 0, dirY: 1 },
      { type: 'shoot_toward_player' },
      { type: 'shoot_direction', dirX: -1, dirY: 1 },
      { type: 'shoot_direction', dirX: 1, dirY: 1 },
      { type: 'wait', frames: 64 },
    ]}
  ]}
];
