import type { ButtonsPressed, IInput } from "./IInput";
import type { IGameEvents } from "../Events/IEvents";
import type { TInitParams } from "../IService";

import { BrowserDriver } from "../../../drivers/BrowserDriver";

type TConstructor = {
   name: string;
};

export class Input implements IInput {
   // deps/services
   private events!: IGameEvents;

   // vars
   public readonly name: string;
   private history: {
      inputs: {
         [frame: string]: ButtonsPressed;
      };
      score: number;
   };
   private buttonsPressed: ButtonsPressed = {
      shoot: false,
      laser: false,
      left: false,
      right: false,
      up: false,
      down: false,
   };
   /**
    * Keep track of which frame it is "locally" in this object.
    * the current frame comes with the "frame_tick" event.
    * Since we want as few dependencies as possible we want to ONLY be dependent on the Events
    * service and NOT also have to grab FrameCount off the GameLoop service directly.
    */
   private frameCount = 0;

   public constructor({ name }: TConstructor) {
      this.name = name;
      this.history = { inputs: {}, score: 0 };
      BrowserDriver.WithWindow(window => {
         window.document.onkeydown = this.onKeyDown;
         window.document.onkeyup = this.onKeyUp;
      });
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      this.events = deps?.events as IGameEvents;

      this.events.subscribeToEvent(this.name, (event) => {
         switch(event.type) {
            case "frame_tick":
               this.frameCount = event.frameNr;
               break;
            case "player_died":
               console.log("Input.history:");
               console.log(this.history);
               break;
         }
      });
   };

   public get ButtonsPressed(): ButtonsPressed {
      const frame = this.frameCount;
      const buttonsPressed = { ...this.buttonsPressed };
      const wasPressed = Object.values(buttonsPressed).includes(true);
      if(wasPressed) {
         Object.keys(buttonsPressed).forEach((k) => {
            if(k === "laser" || k === "shoot" || k === "up" ||
               k === "down" || k === "left" || k === "right") {
               if(buttonsPressed[k] === false) {
                  delete buttonsPressed[k];
               }
            }
         });
         this.history.inputs[frame] = buttonsPressed;
      }
      return this.buttonsPressed;
   }

   // reset() {
   //    this.buttonsPressed = {
   //       space: false,
   //       left: false,
   //       right: false,
   //       up: false,
   //       down: false,
   //    };
   // }

   private onKey = (e: KeyboardEvent, value: boolean) => {
      switch (e.keyCode) {
         case 32:
            // Space
            this.buttonsPressed.shoot = value;
            break;
         case 17:
            // Ctrl
            this.buttonsPressed.laser = value;
            break;
         case 37:
            // Left
            this.buttonsPressed.left = value;
            break;
         case 38:
            // Up
            this.buttonsPressed.up = value;
            break;
         case 39:
            // Right
            this.buttonsPressed.right = value;
            break;
         case 40:
            // Down
            this.buttonsPressed.down = value;
            break;
            // case 27:
            //   // Escape
            //   this.buttonsPressed[Button.RESET] = value;
            //   break;
         default:
      }
   };

   private onKeyDown = (e: KeyboardEvent) => {
      this.onKey(e, true);
   };

   private onKeyUp = (e: KeyboardEvent) => {
      this.onKey(e, false);
   };
}
