import type { IGameEvents } from "../../Events/IEvents";
import type { TInitParams } from "../../IService";
import type { ButtonsPressed, IInput } from "../IInput";

import { replay } from "./replay";

type TConstructor = {
   name: string;
};

/**
 * A Input that replays input that were already recorded.
 * Imports the replay.ts file and simply runs the same inputs.
 */
export class ReplayerInput implements IInput {
   // vars
   public readonly name: string;
   /**
    * Keep track of which frame it is "locally" in this object.
    * the current frame comes with the "frame_tick" event.
    * Since we want as few dependencies as possible we want to ONLY be dependent on the Events
    * service and NOT also have to grab FrameCount off the GameLoop service directly.
    */
   private frameCount = 0;

   // deps/services
   private events!: IGameEvents;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      this.events = deps?.events as IGameEvents;

      this.events.subscribeToEvent(this.name, (event) => {
         switch(event.type) {
            case "frame_tick":
               this.frameCount = event.frameNr;
               break;
         }
      });
   };

   public get ButtonsPressed(): ButtonsPressed {
      const frame = `${this.frameCount}`;
      const allFalse = {
         down: false, left: false, right: false, shoot: false, laser: false, up: false
      };
      if(!(frame in replay.inputs)) {
         return allFalse;
      }
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const buttonsPressed = {...allFalse, ...replay.inputs[frame]} as ButtonsPressed;
      return buttonsPressed;
   }
}
