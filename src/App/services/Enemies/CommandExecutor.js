import type { Action } from "./actionTypes";
import type { Vector } from "../../../math/bezier.js";

import { moveLine } from "../../../math/moveLine.js";

export function* CommandExecutor(
  actions: Action[],
  actionHandler: (Action) => void,
  getFrame: () => number,
  getPosition: () => Vector,
): Generator<void, void, void> {
  let currIndex = 0;
  const nrActions = actions.length;

  while(currIndex < nrActions) { // if index 1 & nr 2 => kosher
    const currAction = actions[currIndex];
    switch(currAction.type) {
      case "repeat": {
        const times = currAction.times;
        for(let i=0; i<times; i++) {
          yield* CommandExecutor(currAction.actions, actionHandler, getFrame, getPosition);
        }
        break;
      }
      
      case 'wait': {
        // console.log('wait');
        const waitUntil = getFrame() + currAction.frames;
        while(getFrame() < waitUntil) {
          yield;
        }
        // console.log('finished waiting');
        break;
      }

      case "move": {
        const startFrame =  getFrame();
        const endFrame = startFrame + currAction.frames;
        const startPos = getPosition();
        while((endFrame - getFrame()) > 0) {
          const passedFrames = getFrame() - startFrame + 1; // The +1 is to make it start at frame 1
          const progress = passedFrames / currAction.frames;
          const position = moveLine(startPos, currAction.movement, progress);
          actionHandler({type: 'set_position', x: position.x, y: position.y});
          yield;
        }
        break;
      }

      default:
        actionHandler(currAction);
    }
    currIndex++;
  }
}