import type { Action } from "../../actionTypes.js";

export const firstMiniBossMoveActions: Action[] = [
  { type: "repeat", times: 9999, actions:[
    { type: 'set_speed', x: 2, y: 0 },
    { type: 'wait', frames: 60 },
    { type: 'set_speed', x: -2, y: 0 },
    { type: 'wait', frames: 120 },
    { type: 'set_speed', x: 2, y: 0 },
    { type: 'wait', frames: 60 },
  ] }
];
