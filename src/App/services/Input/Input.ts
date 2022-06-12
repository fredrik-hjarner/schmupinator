import type { App } from "../../App";
import type { ButtonsPressed, IInput } from "./IInput";

type TConstructor = {
   app: App;
   name: string;
};

export class Input implements IInput {
   app: App;
   name: string;
   history: {
      [frame: string]: ButtonsPressed
   };

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
      this.history = {};
      document.onkeydown = this.onKeyDown;
      document.onkeyup = this.onKeyUp;
   }

   public Init = () => {
      this.app.events.subscribeToEvent(this.name, (event) => {
         if(event.type === "player_died"){
            console.log("Input.history:");
            console.log(this.history);
         }
      });
   };

   public get ButtonsPressed() {
      const frame = this.app.gameLoop.FrameCount;
      const buttonsPressed = { ...this.buttonsPressed };
      const wasPressed = Object.values(buttonsPressed).includes(true);
      if(wasPressed) {
         Object.keys(buttonsPressed).forEach((k) => {
            if(k === "space" || k === "up" || k === "down" ||k === "left" ||k === "right") {
               if(buttonsPressed[k] === false) {
                  delete buttonsPressed[k];
               }
            }
         });
         this.history[frame] = buttonsPressed;
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
