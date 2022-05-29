import type { Vector } from "../../../../../math/bezier";
import type { Action, TMoveToAbsolute } from "../../actionTypes";

import { resolutionWidth } from "../../../../../consts";

const moveToAbsolute = (
  { moveTo, frames}: { moveTo: Partial<Vector>, frames: number},
  mirroredX: boolean
): TMoveToAbsolute => {
  if (!mirroredX) {
    return  { type: 'move_to_absolute', moveTo, frames };
  }
  if(moveTo.x !== undefined) {
    return  {
      type: 'move_to_absolute',
      moveTo: { x: resolutionWidth - moveTo.x, y: moveTo.y },
      frames
    };
  }
  return  { type: 'move_to_absolute',  moveTo, frames };
};

// Helper method. TODO: Hopefully remove this later!
const getX = (distanceBetweenShips: number) => {
  return resolutionWidth/2 - distanceBetweenShips/2;
};

// Maps out the movements of the left one.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const firstMiniBossMoveActions = (dir: number): Action[] => {
  const mirrored = dir === -1;

  return [
    /**
     * New attempt to make positions more exact.
     */
    // Move into view
    moveToAbsolute({ moveTo: {x: getX(125), y: 0}, frames: 40 }, mirrored),
    // move down
    moveToAbsolute({ moveTo: {y: 75}, frames: 52 }, mirrored),
    // semi-circle-left-down // TODO: This is not absolute yet.
    { type: 'move_bezier', bend: {x:0,y:21}, end: {x:30*dir,y:21}, frames: 39},
    { type: 'wait', frames: 25 },
    // semi-circle-right-down // TODO: This is not absolute yet.
    { type: 'move_bezier', bend: {x:0,y:10}, end: {x:-30*dir,y:10}, frames: 39},
    { type: 'wait', frames: 25 },
    // move closer/right
    moveToAbsolute({ moveTo: {x: getX(78)}, frames: 47 }, mirrored),
    { type: 'wait', frames: 25 },
    // move up
    moveToAbsolute({ moveTo: {y: 11}, frames: 100 }, mirrored),
    { type: 'wait', frames: 25 },
    // half-circle-right-down
    { type: 'move_bezier', bend: {x:-50*dir,y:0}, end: {x:-50*dir,y:50}, frames: 50},
    { type: 'move_bezier', bend: {x:0,y:50}, end: {x:50*dir,y:50}, frames: 50},
    { type: 'wait', frames: 25 },
    // move out/right
    moveToAbsolute({ moveTo: {x: getX(158)}, frames: 50 }, mirrored),
    { type: 'wait', frames: 25 },
    // down
    moveToAbsolute({  moveTo: {y: 141}, frames: 30 }, mirrored),
    { type: 'wait', frames: 25 },
    //
    { type: 'move', movement: {x: 0, y: -70}, frames: 70 },



    /**
     * Old relative movements
     */
    // // Move into view
    // { type: 'move', movement: {x: 0, y: 20}, frames: 40 },
    // { type: 'move', movement: {x: 0, y: 110}, frames: 90 },
    // { type: 'move_bezier', bend: {x:0,y:10}, end: {x:30*dir,y:10}, frames: 50},
    // { type: 'wait', frames: 25 },
    // { type: 'move_bezier', bend: {x:0,y:10}, end: {x:-30*dir,y:10}, frames: 50},
    // { type: 'wait', frames: 25 },
    // { type: 'move', movement: {x: 30*dir, y: 0}, frames: 50 },
    // { type: 'wait', frames: 25 },
    // { type: 'move', movement: {x: 0, y: -100}, frames: 100 },
    // { type: 'wait', frames: 25 },
    // { type: 'move_bezier', bend: {x:-50*dir,y:0}, end: {x:-50*dir,y:50}, frames: 50},
    // { type: 'move_bezier', bend: {x:0,y:50}, end: {x:50*dir,y:50}, frames: 50},
    // { type: 'wait', frames: 25 },
    // { type: 'move', movement: {x: -50*dir, y: 0}, frames: 50 },
    // { type: 'wait', frames: 25 },
    // { type: 'move', movement: {x: 0, y: 30}, frames: 30 },
    // { type: 'wait', frames: 25 },
    // { type: 'move', movement: {x: 0, y: -70}, frames: 70 },
  ];
};

export const firstMiniBossMoveActions1: Action[] = firstMiniBossMoveActions(1);

export const firstMiniBossMoveActions2: Action[] = firstMiniBossMoveActions(-1);