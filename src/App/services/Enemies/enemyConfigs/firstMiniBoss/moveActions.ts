import type { Vector } from "../../../../../math/bezier";
import type { TShortFormAction, TShortFormMoveToAbsolute } from "../../actionTypesShortForms";

import { resolutionHeight as resHeight, resolutionWidth as resWidth } from "../../../../../consts";

const moveToAbsolute = (
   { moveTo, frames}: { moveTo: Partial<Vector>, frames: number},
   mirroredX: boolean
): TShortFormMoveToAbsolute => {
   if (!mirroredX) {
      return  { moveToAbsolute: moveTo, frames };
   }
   if(moveTo.x !== undefined) {
      return  {
         moveToAbsolute: { x: resWidth - moveTo.x, y: moveTo.y },
         frames
      };
   }
   return  { moveToAbsolute: moveTo, frames };
};

// Helper method. TODO: Hopefully remove this later!
const getX = (distanceBetweenShips: number) => {
   return resWidth/2 - distanceBetweenShips/2;
};

// Maps out the movements of the left one.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const firstMiniBossMoveActions = (dir: number): TShortFormAction[] => {
   const mirrored = dir === -1;

   return [
      // Move into view
      moveToAbsolute({ moveTo: {x: getX(125), y: 0}, frames: 40 }, mirrored),
      // move down
      moveToAbsolute({ moveTo: {y: 75}, frames: 52 }, mirrored),
      // semi-circle-left-down // TODO: This is not absolute yet.
      { type: "move_bezier", bend: {x:0,y:21}, end: {x:30*dir,y:21}, frames: 39},
      { wait: 25 },
      // semi-circle-right-down // TODO: This is not absolute yet.
      { type: "move_bezier", bend: {x:0,y:10}, end: {x:-30*dir,y:10}, frames: 39},
      { wait: 25 },
      // move closer/right
      moveToAbsolute({ moveTo: {x: getX(78)}, frames: 47 }, mirrored),
      { wait: 25 },
      // move up
      moveToAbsolute({ moveTo: {y: 11}, frames: 100 }, mirrored),
      { wait: 25 },
      // half-circle-left-down
      { type: "rotate_around_absolute_point", point: {y: 61}, degrees: -180*dir, frames: 100 },
      { wait: 25 },
      // move out/right
      moveToAbsolute({ moveTo: {x: getX(158)}, frames: 50 }, mirrored),
      { wait: 25 },
      // down
      moveToAbsolute({  moveTo: {y: 141}, frames: 30 }, mirrored),
      { wait: 25 },
      // up
      moveToAbsolute({  moveTo: {y: 61}, frames: 80 }, mirrored),
      // left-down closer (not made exact)
      moveToAbsolute({  moveTo: {x: getX(80), y: 105}, frames: 40 }, mirrored),
      { wait: 25 },
      // rotate one full circle clockwise. (not made exact)
      { type: "rotate_around_absolute_point", point: { x: resWidth/2}, degrees: 360, frames: 240 },
      { wait: 25 },
      // rotate one full circle again but counter-clockwise. (not made exact)
      { type: "rotate_around_absolute_point", point: {x: resWidth/2}, degrees: -360, frames: 240 },
      { wait: 25 },
      // move out of the screen (not made exact)
      moveToAbsolute({ moveTo: {x: getX(160), y: resHeight+50}, frames: 210 }, mirrored),
   ];
};

export const firstMiniBossMoveActions1: TShortFormAction[] = firstMiniBossMoveActions(1);

export const firstMiniBossMoveActions2: TShortFormAction[] = firstMiniBossMoveActions(-1);