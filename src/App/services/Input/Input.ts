import type { App } from "../../App";
import type { ButtonsPressed, IInput } from "./IInput";

type TConstructor = {
   app: App;
   name: string;
};

export class Input implements IInput {
   app: App;
   name: string;

   private buttonsPressed: ButtonsPressed = {
      space: false,
      left: false,
      right: false,
      up: false,
      down: false,
   };

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      document.onkeydown = this.onKeyDown;
      document.onkeyup = this.onKeyUp;
   }

   public get ButtonsPressed() {
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
            this.buttonsPressed.space = value;
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
