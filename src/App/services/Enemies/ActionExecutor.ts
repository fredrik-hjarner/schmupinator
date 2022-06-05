import type { TAction } from "./actionTypes";
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
  actionLists: TAction[][];
  actionHandler: (action: TAction) => void;
  getPosition: () => TVector;
}

export class ActionExecutor {
  actionHandler: (action: TAction) => void;
  getPosition: () => TVector;
  generators: Generator<void, void, void>[];

  constructor({ actionLists, actionHandler, getPosition }: TActionExecutorArgs) {
    this.actionHandler = actionHandler;
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
  
  *generator(actions: TAction[]): Generator<void, void, void> {
    let currIndex = 0;
    const nrActions = actions.length;
  
    while(currIndex < nrActions) { // if index 1 & nr 2 => kosher
      const currAction = actions[currIndex];
      switch(currAction.type) {
        case "parallell_race": {
          const { actionsLists } = currAction;
          const generators = actionsLists.map(actions => this.generator(actions));
          // advance generators one step.
          let results = generators.map(generator => generator.next());
          // Loop until one if done
          while(!results.some(result => result.done)) {
            // yield because after running once, something needed to wait/yield.
            yield;
            // advance generators one step.
            results = generators.map(generator => generator.next());
          }
          break;
        }
        case "repeat": {
          const times = currAction.times;
          for(let i=0; i<times; i++) {
            yield* this.generator(currAction.actions);
          }
          break;
        }

        case "wait_next_frame": {
          yield;
          break;
        }
        
        case 'wait': {
          /**
           * TODO: I should be able to remove currentFrame right?
           * I could just yield the number of times in currAction.frames, right?
           */
          for(let i=0; i<currAction.frames; i++) {
            yield;
          }
          break;
        }
  
        case 'rotate_around_point':
        case "move_to_absolute":
        case "move_bezier":
        case "move": {
          const startPos = this.getPosition();
          /**
           * Start from 1 so that first step is not zero progression, but first step of progression.
           * Allow passedFrames to go up to (include) currActon.frames, i.e. if 4 then
           * allow passedFrames to go all the way up to 4.
           */
          for(let passedFrames=1; passedFrames<=currAction.frames; passedFrames++) {
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
              const pointX = currAction.point.x ?? startPos.x;
              const pointY = currAction.point.y ?? startPos.y;
              const pointVector = new Vector(pointX, pointY);
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
