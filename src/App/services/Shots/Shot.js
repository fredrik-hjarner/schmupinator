import { resolutionHeight, resolutionWidth } from "../../../consts.js";
import { Circle } from "../../../Circle.js";

export class Shot {
  /**
   * Public
   */
  constructor(
    { x, y, spdX, spdY, active }:
    {x: number, y: number, spdX: number, spdY: number, active: boolean}
  ) {
    this.origX = x;
    this.origY = y;
    this.circle = new Circle(x, y, 6);
    this.spdX = spdX;
    this.spdY = spdY;
    this.active = active;
  }
  
  Update = () => {
    if(!this.active) {
      return;
    }
    this.circle.X += this.spdX;
    this.circle.Y += this.spdY;
    this.bound();
  };

  /**
   * Private
   */
  destroy = () => {
    // Inactivate and set back at resting place.
    this.active = false;
    this.circle.X = this.origX;
    this.circle.Y = this.origY;
  };

  bound = () => {
    if(this.circle.Left < 0) {
      this.destroy();
    } else if(this.circle.Right > resolutionWidth) {
      this.destroy();
    }
    if(this.circle.Top < 0) {
      this.destroy();
    } else if (this.circle.Bottom > resolutionHeight) {
      this.destroy();
    }
  };
}