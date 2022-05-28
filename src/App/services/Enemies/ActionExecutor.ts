import type { Action } from "./actionTypes";

import { bezier, Vector } from "../../../math/bezier";
import { moveLine } from "../../../math/moveLine";

type TActionExecutorArgs = {
  /**
   * An array of Action arrays.
   * The outer arrays will execute in parallell.
   * The actions in Action[] execute sequentially.
   */
  actionLists: Action[][];
  actionHandler: (Action) => void;
  getFrame: () => number;
  getPosition: () => Vector;
}

export class ActionExecutor {
  actionHandler: (Action) => void;
  getFrame: () => number;
  getPosition: () => Vector;
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
  
        case "move_bezier":
        case "move": {
          const startFrame =  this.getFrame();
          const endFrame = startFrame + currAction.frames;
          const startPos = this.getPosition();
          while((endFrame - this.getFrame()) > 0) {
            // The +1 is to make it start at frame 1
            const passedFrames = this.getFrame() - startFrame + 1;
            const progress = passedFrames / currAction.frames;
            if(currAction.type === "move") {
              const position = moveLine(startPos, currAction.movement, progress);
              this.actionHandler({type: 'set_position', x: position.x, y: position.y});
            }
            if(currAction.type === "move_bezier") {
              const position = bezier(currAction.bend, currAction.end, progress);
              this.actionHandler({
                type: 'set_position',
                x: startPos.x + position.x,
                y: startPos.y + position.y
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
