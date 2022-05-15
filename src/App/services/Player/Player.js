import type { App } from "../../App.js";

import {
  framesBewteenPlayerShots, playerShotSpeed, playerSpeedPerFrame, resolutionHeight, resolutionWidth
} from "../../../consts.js";
import { Circle } from "../../../Circle.js";
import { Shot } from "../Shots/Shot.js";

export class Player {
  app: App;
  circle: Circle;
  lastShotFrame: number;

  /**
   * Public
   */
  constructor(app: App) {
    this.app = app;
    this.circle = new Circle(100, 100, 20);
    this.lastShotFrame = 0;
  }

  /**
   * Init runs after bootstrap.
   * If it needs to use things on app dont do that in the constructor
   * since the order on they are added to app makes a difference in
   * that case.
   */
  Init = () => {
    this.app.gameLoop.SubscribeToNextFrame("updatePlayer", this.updatePlayer);
  };

  /**
   * Private
   */
  bound = () => {
    if(this.circle.Left < 0) {
      this.circle.Left = 0;
    } else if(this.circle.Right > resolutionWidth) {
      this.circle.Right = resolutionWidth;
    }
    if(this.circle.Top < 0) {
      this.circle.Top = 0;
    } else if (this.circle.Bottom > resolutionHeight) {
      this.circle.Bottom = resolutionHeight;
    }
  };

  updatePlayer = () => {
    const input = this.app.input;

    const speed = playerSpeedPerFrame[0];

    if (input.buttonsPressed.left) {
      this.circle.X -= speed;
    }
    if (input.buttonsPressed.right) {
      this.circle.X += speed;
    }
    if (input.buttonsPressed.up) {
      this.circle.Y -= speed;
    }
    if (input.buttonsPressed.down) {
      this.circle.Y += speed;
    }
    if(input.buttonsPressed.space) {
      const frame = this.app.gameLoop.FrameCount;
      /**
       * Limit frequency of shots.
       * TODO: Should probably limit nr of shots as well,
       * perhaps by tagging shots with a string.
       */
      if(frame - this.lastShotFrame >= framesBewteenPlayerShots) {
        const spdY = -playerShotSpeed;
        new Shot(this.app, { x: this.circle.X, y: this.circle.Y, spdX: 0, spdY });
        new Shot(this.app, { x: this.circle.X, y: this.circle.Y, spdX: 0.9, spdY });
        new Shot(this.app, { x: this.circle.X, y: this.circle.Y, spdX: -0.9, spdY });
        this.lastShotFrame = this.app.gameLoop.FrameCount;
      }
    }

    this.bound();
  };
}