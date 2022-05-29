import type { Action } from "../../actionTypes";

export const firstMiniBossShootActions: Action[] = [
  { type: 'wait', frames: 75 },
  { type: "repeat", times: 9999, actions: [
    { type: "set_shot_speed", pixelsPerFrame: 2.6 },
    // beam
    { type: 'shoot_direction', dirX: 0, dirY: 1 },
    { type: 'wait', frames: 3 },
    { type: 'shoot_direction', dirX: 0, dirY: 1 },
    { type: 'wait', frames: 3 },
    { type: 'shoot_direction', dirX: 0, dirY: 1 },
    { type: 'wait', frames: 64 - 3 - 3 },
    // triplets
    { type: "set_shot_speed", pixelsPerFrame: 2.2 },
    { type: "repeat", times: 2, actions: [
      { type: 'shoot_toward_player' },
      { type: 'shoot_beside_player', clockwiseDegrees: 25 },
      { type: 'shoot_beside_player', clockwiseDegrees: -25 },
      { type: 'wait', frames: 64 },
    ]}
  ]}
];
