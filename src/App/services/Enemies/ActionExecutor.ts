import type { Action } from "./actionTypes";
import type { Vector as TVector } from "../../../math/bezier";

import { bezier } from "../../../math/bezier";
import { moveLine } from "../../../math/moveLine";
import { Vector } from "../../../math/Vector";
import { Angle } from "../../../math/Angle";

type TActionExecutorArgs = {
  /**
   * An array of Action arrays.
   * The outer arrays will execute in parallell.
   * The actions in Action[] execute sequentially.
   */
  actionLists: Action[][];
  actionHandler: (action: Action) => void;
  getFrame: () => number;
  getPosition: () => TVector;
}

export class ActionExecutor {
  actionHandler: (action: Action) => void;
  getFrame: () => number;
  getPosition: () => TVector;
  generators: Generator<void, void, void>[];

  constructor({ actionLists, actionHandler, getFrame, getPosition }: TActionExecutorArgs) {
    this.actionHandler = actionHandler;
    this.getFrame = getFrame;
    this.getPosition = getPosition;
    this.generators = actionLists.map(actionList => this.generator(actionList));
  }

  ProgressOneFrame() {
    // Execute each generator (actionList) in parallell.
    this.generators.forEach(g => { g.next(); });
  }

  /**
   * Private
   */
  
  *generator(actions: Action[]): Generator<void, void, void> {
    let currIndex = 0;
    const nrActions = actions.length;
  
    while(currIndex < nrActions) { // if index 1 & nr 2 => kosher
      const currAction = actions[currIndex];
      switch(currAction.type) {
        case "repeat": {
          const times = currAction.times;
          for(let i=0; i<times; i++) {
            yield* this.generator(currAction.actions);
          }
          break;
        }
        
        case 'wait': {
          // console.log('wait');
          const waitUntil = this.getFrame() + currAction.frames;
          while(this.getFrame() < waitUntil) {
            yield;
          }
          // console.log('finished waiting');
          break;
        }
  
        case 'rotate_around_point':
        case "move_to_absolute":
        case "move_bezier":
        case "move": {
          const startFrame =  this.getFrame();
          const endFrame = startFrame + currAction.frames;
          const startPos = this.getPosition();
          while((endFrame - this.getFrame()) > 0) {
            // The +1 is to make it start at frame 1
            const passedFrames = this.getFrame() - startFrame + 1;
            const progress = passedFrames / currAction.frames;
            // TODO: Change to switch instead.
            if(currAction.type === "move") {
              const position = moveLine(startPos, currAction.movement, progress);
              this.actionHandler({type: 'set_position', x: position.x, y: position.y});
            } else if(currAction.type === "move_to_absolute") {
              const { moveTo } = currAction;
              const xToGo = moveTo.x !== undefined ? moveTo.x - startPos.x : 0;
              const yToGo = moveTo.y !== undefined ? moveTo.y - startPos.y : 0;
              const position = { x: startPos.x + xToGo*progress, y: startPos.y + yToGo*progress}; 
              this.actionHandler({type: 'set_position', x: position.x, y: position.y});
            } else if(currAction.type === "move_bezier") {
              const position = bezier(currAction.bend, currAction.end, progress);
              this.actionHandler({
                type: 'set_position',
                x: startPos.x + position.x,
                y: startPos.y + position.y
              });
            } else if(currAction.type) {
              const startPosVector = new Vector(startPos.x, startPos.y);
              const pointVector = new Vector(currAction.point.x, currAction.point.y);
              // const vectorFromPointToStart = Vector.fromTo(pointVector, startPosVector);
              const rotatedVector = startPosVector.rotateClockwiseAroundVector(
                Angle.fromDegrees(progress*currAction.degrees),
                pointVector
              );
              this.actionHandler({
                type: 'set_position',
                x: rotatedVector.x,
                y: rotatedVector.y
              });
            }
            yield;
          }
          break;
        }
  
        default:
          this.actionHandler(currAction);
      }
      currIndex++;
    }
  }
}
