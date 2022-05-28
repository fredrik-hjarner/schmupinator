export class GamePad {
  constructor() {
    window.addEventListener("gamepadconnected", function(e) {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
    });
  }

  get shoot(): boolean { return this.getPressedButton(0); }
  get left(): boolean { return this.getPressedButton(14); }
  get right(): boolean { return this.getPressedButton(15); }
  get up(): boolean { return  this.getPressedButton(12); }
  get down(): boolean { return this.getPressedButton(13); }

  getPressedButton = (index: number): boolean => {
    const gamepads = navigator.getGamepads();
    if(gamepads.length < 1) {
      return false;
    }
    const gamepad = gamepads[0];
    if(!gamepad) {
      return false;
    }
    return !!gamepad.buttons?.[index]?.pressed;
  };
}