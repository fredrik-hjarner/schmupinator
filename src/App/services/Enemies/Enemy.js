import type { App } from "../../App.js";
import type { PotentialShot } from "../Shots/PotentialShot";

import {
  enemyShotSpeed, playerSpeedPerFrame, resolutionHeight, resolutionWidth
} from "../../../consts.js";
import { Circle } from "../../../Circle.js";

export class Enemy {
  app: App;
  circle: Circle;
  lastShotFrame: number;

  /**
   * Public
   */
  constructor(app: App, { frameBetweenShots }: { frameBetweenShots: number }) {
    this.app = app;
    this.frameBetweenShots = frameBetweenShots;
    this.circle = new Circle(resolutionWidth/2, 20, 20, 'red');
    this.lastShotFrame = 0;
  }

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

  Update = () => {
    const input = this.app.input;

    const speed = playerSpeedPerFrame[0];

    if (input.buttonsPressed.left) {
      this.circle.X += speed;
    }
    if (input.buttonsPressed.right) {
      this.circle.X -= speed;
    }
    if (input.buttonsPressed.up) {
      this.circle.Y += speed;
    }
    if (input.buttonsPressed.down) {
      this.circle.Y -= speed;
    }

    const frame = this.app.gameLoop.FrameCount;
    /**
     * Limit frequency of shots.
     */
    if(frame - this.lastShotFrame >= this.frameBetweenShots) {
      const spdY = -enemyShotSpeed;
      const potentialShots: PotentialShot[] = [
        { x: this.circle.X, y: this.circle.Bottom, spdX: 0, spdY: -spdY },
        { x: this.circle.X, y: this.circle.Bottom, spdX: 1.5, spdY: -spdY },
        { x: this.circle.X, y: this.circle.Bottom, spdX: -1.5, spdY: -spdY },
      ];
      this.app.enemyShots.TryShoot(potentialShots);
      this.lastShotFrame = this.app.gameLoop.FrameCount;
    }

    this.bound();
  };
}