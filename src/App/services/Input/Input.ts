type ButtonsPressed = {
  space: boolean
  left: boolean
  right: boolean
  up: boolean
  down: boolean
}

export class Input {
   buttonsPressed: ButtonsPressed = {
      space: false,
      left: false,
      right: false,
      up: false,
      down: false,
   };

   constructor() {
      document.onkeydown = this.onKeyDown;
      document.onkeyup = this.onKeyUp;
   }

   reset() {
      this.buttonsPressed = {
         space: false,
         left: false,
         right: false,
         up: false,
         down: false,
      };
   }

   onKey = (e: KeyboardEvent, value: boolean) => {
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

   onKeyDown = (e: KeyboardEvent) => {
      this.onKey(e, true);
   };

   onKeyUp = (e: KeyboardEvent) => {
      this.onKey(e, false);
   };
}
