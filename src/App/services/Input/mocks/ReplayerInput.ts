import type { App } from "../../../App";
import type { ButtonsPressed, IInput } from "../IInput";

import { BrowserDriver, IsBrowser } from "../../../../drivers/BrowserDriver";
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
            const actual = this.app.points.points;
            const expected = replay.score;
            const seconds = (BrowserDriver.PerformanceNow() - this.startTime)/1000;
            const timeStr = `took ${seconds} seconds to run test.`;
            if(actual === expected){
               const msg = `Test Success\nscore: ${expected}\ngot: ${actual}\n${timeStr}`;
               if(IsBrowser()){
                  BrowserDriver.Alert(msg);
               } else {
                  console.log(msg);
                  // eslint-disable-next-line no-undef
                  process.exit(0);
               }
            } else {
               const msg = `Test Failure\nexpected: ${expected}\ngot: ${actual}\n${timeStr}`;
               if(IsBrowser()){
                  BrowserDriver.Alert(msg);
               } else {
                  console.log(msg);
                  // eslint-disable-next-line no-undef
                  process.exit(1);
               }
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
