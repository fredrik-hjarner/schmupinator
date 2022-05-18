import type { App } from "../../App";
import type { Action } from "./actionTypes";

export function* CommandExecutor(
  app: App, actions: Action[], actionHandler: (Action) => void
): Generator<void, void, void> {
  let currIndex = 0;
  const nrActions = actions.length;

  // while(true) {
  while(currIndex < nrActions) { // if index 1 & nr 2 => kosher
    const currAction = actions[currIndex];
    switch(currAction.type) {
      case "repeat": {
        const times = currAction.times;
        for(let i=0; i<times; i++) {
          yield* CommandExecutor(app, currAction.actions, actionHandler);
        }
        break;
      }
      
      case 'wait': {
        // console.log('wait');
        const waitUntil = app.gameLoop.FrameCount + currAction.frames;
        while(app.gameLoop.FrameCount < waitUntil) {
          yield;
        }
        // console.log('finished waiting');
        break;
      }

      default:
        actionHandler(currAction);
    }
    currIndex++;
    // if(currIndex >= nrActions) { // index 1+1 & nr 2 => not kosher
    //   currIndex = 0; // start from beginning.
    // }
  }
}