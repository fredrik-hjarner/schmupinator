import type { Action } from "../../actionTypes.js";

export const firstMiniBossMoveActions1: Action[] = [
  { type: "repeat", times: 9999, actions:[
    { type: 'set_speed', x: 2, y: 0 },
    { type: 'wait', frames: 60 },
    { type: 'set_speed', x: -2, y: 0 },
    { type: 'wait', frames: 120 },
    { type: 'set_speed', x: 2, y: 0 },
    { type: 'wait', frames: 60 },
  ] }
];

export const firstMiniBossMoveActions2: Action[] = [
  { type: "repeat", times: 9999, actions:[
    { type: 'move', movement: {x: 100, y: 100}, frames: 300 },
    { type: 'wait', frames: 60 },
    { type: 'move', movement: {x: -100, y: -100}, frames: 300 },
    { type: 'wait', frames: 60 },
  ] }
];