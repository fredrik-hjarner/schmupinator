import type { Action } from "../../actionTypes";

const firstMiniBossMoveActions = (dir: number): Action[] => ([
  { type: 'move', movement: {x: 0, y: 130}, frames: 120 },
  { type: 'move_bezier', bend: {x:0,y:10}, end: {x:30*dir,y:10}, frames: 50},
  { type: 'wait', frames: 25 },
  { type: 'move_bezier', bend: {x:0,y:10}, end: {x:-30*dir,y:10}, frames: 50},
  { type: 'wait', frames: 25 },
  { type: 'move', movement: {x: 30*dir, y: 0}, frames: 50 },
  { type: 'wait', frames: 25 },
  { type: 'move', movement: {x: 0, y: -100}, frames: 100 },
  { type: 'wait', frames: 25 },
  { type: 'move_bezier', bend: {x:-50*dir,y:0}, end: {x:-50*dir,y:50}, frames: 50},
  { type: 'move_bezier', bend: {x:0,y:50}, end: {x:50*dir,y:50}, frames: 50},
  { type: 'wait', frames: 25 },
  { type: 'move', movement: {x: -50*dir, y: 0}, frames: 50 },
  { type: 'wait', frames: 25 },
  { type: 'move', movement: {x: 0, y: 30}, frames: 30 },
  { type: 'wait', frames: 25 },
  { type: 'move', movement: {x: 0, y: -70}, frames: 70 },
]);

export const firstMiniBossMoveActions1: Action[] = firstMiniBossMoveActions(1);

export const firstMiniBossMoveActions2: Action[] = firstMiniBossMoveActions(-1);