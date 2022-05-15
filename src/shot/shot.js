import type { App } from "../App.js";

import { resolutionHeight, resolutionWidth } from "../consts.js";
import { Circle } from "../Circle.js";

export class Shot {
  /**
   * Public
   */
  constructor(app: App, { x, y, spdX, spdY }: {x: number, y: number, spdX: number, spdY: number}) {
    this.app = app;
    this.circle = new Circle(x, y, 20);
    this.spdX = spdX;
    this.spdY = spdY;
    // TODO: This might be slow, maybe.
    this.app.gameLoop.SubscribeToNextFrame(this.circle.UUID, this.update);
  }

  /**
   * Init runs after bootstrap.
   * If it needs to use things on app dont do that in the constructor
   * since the order on they are added to app makes a difference in
   * that case.
   */
  Init = () => {
    // noop
  };

  /**
   * Private
   */
  destroy = () => {
    // this.dying = true // I dont know myabe would be safe to have.
    this.app.gameLoop.UnsubscribeToNextFrame(this.circle.UUID);
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

  update = () => {
    this.circle.X += this.spdX;
    this.circle.Y += this.spdY;
    this.bound();
  };
}