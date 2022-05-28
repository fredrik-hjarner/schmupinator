import type { Action } from "../../actionTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const firstMiniBossMoveActions = (dir: number): Action[] => ([
  // Move into view
  { type: 'move', movement: {x: 0, y: 20}, frames: 40 },
  { type: 'move', movement: {x: 0, y: 110}, frames: 90 },
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