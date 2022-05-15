import type { App } from "../App/App.js";

import { resolutionHeight, resolutionWidth } from "../consts.js";
import { Circle } from "../Circle.js";

export class Shot {
  /**
   * Public
   */
  constructor(app: App, { x, y, spdX, spdY }: {x: number, y: number, spdX: number, spdY: number}) {
    this.app = app;
    this.circle = new Circle(x, y, 10);
    this.spdX = spdX;
    this.spdY = spdY;

    this.app.shots.AddShotToShots(this);
  }
  
  Update = () => {
    this.circle.X += this.spdX;
    this.circle.Y += this.spdY;
    this.bound();
  };

  /**
   * Private
   */
  destroy = () => {
    // this.dying = true // I dont know myabe would be safe to have.
    this.app.shots.RemoveShotFromShots(this);
    this.circle.div.remove(); // TODO: Ought to be on Circle!
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