import type { App } from "../../../App";
import type { ButtonsPressed, IInput } from "../IInput";

import { replay } from "./replay";

type TConstructor = {
   app: App;
   name: string;
};

/**
 * A Input that replays input that were already recorded.
 * Imports the replay.ts file and simply runs the same inputs.
 */
export class ReplayerInput implements IInput {
   app: App;
   name: string;
   startTime: number;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.startTime = performance.now();
   }

   public Init = () => {
      this.app.events.subscribeToEvent(this.name, (event) => {
         if(event.type === "player_died"){
            const actualScore = this.app.points.points;
            const expectedScore = replay.score;
            const seconds = (performance.now() - this.startTime)/1000;
            const timeStr = `took ${seconds} seconds to run test.`;
            if(actualScore === expectedScore){
               alert(`Test Success\nscore: ${expectedScore}\n${timeStr}`);
            } else {
               alert(`Test Failure\nexpected: ${expectedScore}\ngot: ${actualScore}\n${timeStr}`);
            }
         }
      });
   };

   public get ButtonsPressed(): ButtonsPressed {
      const frame = `${this.app.gameLoop.FrameCount}`;
      const allFalse = { down: false, left: false, right: false, space: false, up: false };
      if(!(frame in replay.inputs)) {
         return allFalse;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const buttonsPressed = {...allFalse, ...replay.inputs[frame]} as ButtonsPressed;
      return buttonsPressed;
   }
}
