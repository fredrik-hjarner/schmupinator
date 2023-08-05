import type { IService } from "../IService";

import { BrowserDriver, IsBrowser } from "../../../drivers/BrowserDriver";

type TConstructor = {
   name: string;
}

export class GamePad implements IService {
   public readonly name: string;

   public constructor(params: TConstructor) {
      this.name = params.name;
      BrowserDriver.WithWindow(window => {
         window.addEventListener("gamepadconnected", function(e) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
               e.gamepad.index, e.gamepad.id,
               e.gamepad.buttons.length, e.gamepad.axes.length);
         });
      });
   }
   
   public Init = async () => {
      // noop
   };

   public get shoot(): boolean { return this.getPressedButton(0); }
   /**
    * TODO: Set correct button for laser.
    */
   public get laser(): boolean { return this.getPressedButton(1); }
   public get left(): boolean { return this.getPressedButton(14); }
   public get right(): boolean { return this.getPressedButton(15); }
   public get up(): boolean { return  this.getPressedButton(12); }
   public get down(): boolean { return this.getPressedButton(13); }

   private getPressedButton = (index: number): boolean => {
      if(!IsBrowser()) {
         return false;
      }
      return BrowserDriver.WithWindow(window => {
         const gamepads = window.navigator.getGamepads();
         if(gamepads.length < 1) {
            return false;
         }
         const gamepad = gamepads[0];
         if(!gamepad) {
            return false;
         }
         return !!gamepad.buttons[index]?.pressed;
      })!;
   };
}
