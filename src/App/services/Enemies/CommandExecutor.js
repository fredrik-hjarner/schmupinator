import type { Action } from "./actionTypes";

export function* CommandExecutor(
  actions: Action[],
  actionHandler: (Action) => void,
  getFrame: () => number,
  // getPosition: () => number,
): Generator<void, void, void> {
  let currIndex = 0;
  const nrActions = actions.length;

  while(currIndex < nrActions) { // if index 1 & nr 2 => kosher
    const currAction = actions[currIndex];
    switch(currAction.type) {
      case "repeat": {
        const times = currAction.times;
        for(let i=0; i<times; i++) {
          yield* CommandExecutor(currAction.actions, actionHandler, getFrame);
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

      default:
        actionHandler(currAction);
    }
    currIndex++;
  }
}