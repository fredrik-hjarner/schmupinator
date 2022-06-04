import type { Vector } from "../../../../../math/bezier";
import type { Action, TMoveToAbsolute } from "../../actionTypes";

import { resolutionHeight as resHeight, resolutionWidth as resWidth } from "../../../../../consts";

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
      moveTo: { x: resWidth - moveTo.x, y: moveTo.y },
      frames
    };
  }
  return  { type: 'move_to_absolute',  moveTo, frames };
};

// Helper method. TODO: Hopefully remove this later!
const getX = (distanceBetweenShips: number) => {
  return resWidth/2 - distanceBetweenShips/2;
};

// Maps out the movements of the left one.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const firstMiniBossMoveActions = (dir: number): Action[] => {
  const mirrored = dir === -1;

  return [
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
    // half-circle-left-down
    { type: 'rotate_around_point', point: {y: 61}, degrees: -180*dir, frames: 100 },
    { type: 'wait', frames: 25 },
    // move out/right
    moveToAbsolute({ moveTo: {x: getX(158)}, frames: 50 }, mirrored),
    { type: 'wait', frames: 25 },
    // down
    moveToAbsolute({  moveTo: {y: 141}, frames: 30 }, mirrored),
    { type: 'wait', frames: 25 },
    // up
    moveToAbsolute({  moveTo: {y: 61}, frames: 80 }, mirrored),
    // left-down closer (not made exact)
    moveToAbsolute({  moveTo: {x: getX(80), y: 105}, frames: 40 }, mirrored),
    { type: 'wait', frames: 25 },
    // rotate one full circle clockwise. (not made exact)
    { type: 'rotate_around_point', point: { x: resWidth/2}, degrees: 360, frames: 240 },
    { type: 'wait', frames: 25 },
    // rotate one full circle again but counter-clockwise. (not made exact)
    { type: 'rotate_around_point', point: { x: resWidth/2 }, degrees: -360, frames: 240 },
    { type: 'wait', frames: 25 },
    // move out of the screen (not made exact)
    moveToAbsolute({ moveTo: {x: getX(160), y: resHeight+50}, frames: 210 }, mirrored),
  ];
};

export const firstMiniBossMoveActions1: Action[] = firstMiniBossMoveActions(1);

export const firstMiniBossMoveActions2: Action[] = firstMiniBossMoveActions(-1);