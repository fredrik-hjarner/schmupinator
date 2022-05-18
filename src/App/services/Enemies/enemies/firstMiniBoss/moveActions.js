import type { Action } from "../../actionTypes.js";

export const firstMiniBossMoveActions1: Action[] = [
  { type: "repeat", times: 9999, actions:[
    { type: 'move_bezier', start: {x:0,y:0}, bend: {x:100,y:0}, end: {x:100,y:100}, frames: 300 },
    { type: 'wait', frames: 60 },
    { type: 'move_bezier',start: {x:0,y:0}, bend: {x:-100,y:0}, end: {x:-100,y:-100}, frames: 300},
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