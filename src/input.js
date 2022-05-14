
export class Input {
  buttonsPressed = {
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
      left: false,
      right: false,
      up: false,
      down: false,
    };
  }

  onKey = (e, value) => {
    switch (e.keyCode) {
      // case 32:
      //   // Space
      //   this.buttonsPressed[Button.TURN_AROUND] = value;
      //   break;
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

  onKeyDown = (e) => {
    this.onKey(e, true);
  };

  onKeyUp = (e) => {
    this.onKey(e, false);
  };
}
