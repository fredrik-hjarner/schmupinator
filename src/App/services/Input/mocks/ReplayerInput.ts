import type { App } from "../../../App";
import type { ButtonsPressed, IInput } from "../IInput";

import { BrowserDriver } from "../../../../drivers/BrowserDriver";
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
      this.startTime = BrowserDriver.PerformanceNow();
   }

   public Init = () => {
      this.app.events.subscribeToEvent(this.name, (event) => {
         if(event.type === "player_died"){
            const actualScore = this.app.points.points;
            const expectedScore = replay.score;
            const seconds = (BrowserDriver.PerformanceNow() - this.startTime)/1000;
            const timeStr = `took ${seconds} seconds to run test.`;
            if(actualScore === expectedScore){
               BrowserDriver.Alert(
                  `Test Success\nscore: ${expectedScore}\ngot: ${actualScore}\n${timeStr}`
               );
            } else {
               BrowserDriver.Alert(
                  `Test Failure\nexpected: ${expectedScore}\ngot: ${actualScore}\n${timeStr}`
               );
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
