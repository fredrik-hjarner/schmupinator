import type { App } from "../../App";
import type { PotentialShot } from "../Shots/PotentialShot";
import type { TCollisions } from "../Collisions/Collisions";

import {
  framesBewteenPlayerShots, playerInvincible, playerShotSpeed,
  playerSpeedPerFrame, resolutionHeight, resolutionWidth
} from "../../../consts";
import { Circle } from "../../../Circle";

export class Player {
  app: App;
  circle: Circle;
  lastShotFrame: number;

  /**
   * Public
   */
  constructor(app: App) {
    this.app = app;
    this.circle = new Circle(resolutionWidth/2, resolutionHeight-20, 20, 'aqua');
    this.lastShotFrame = 0;
  }

  /**
   * Init runs after bootstrap.
   * If it needs to use things on app dont do that in the constructor
   * since the order on they are added to app makes a difference in
   * that case.
   */
  Init = () => {
    // TODO: Use this.name instead.
    this.app.events.subscribeToEvent(
      "updatePlayer",
      event => {
        switch(event.type) {
          case 'frame_tick':
            this.onFrameTick();
            break;
          case 'collisions':
            this.onCollisions(event.collisions);
            break;
        }
      }
    );
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
  
  private onCollisions = (collisions: TCollisions) => {
    /**
     * Check player death
     */
    if(!playerInvincible) {
      if(collisions.playerWasHit) {
        location.reload();
      }
    }
  };

  private onFrameTick = () => {
    /**
     * Check input
     */
    const input = this.app.input;
    const gamepad = this.app.gamepad;

    const speed = playerSpeedPerFrame[0];

    if (input.buttonsPressed.left || gamepad.left) {
      this.circle.X -= speed;
    }
    if (input.buttonsPressed.right || gamepad.right) {
      this.circle.X += speed;
    }
    if (input.buttonsPressed.up || gamepad.up) {
      this.circle.Y -= speed;
    }
    if (input.buttonsPressed.down || gamepad.down) {
      this.circle.Y += speed;
    }
    if(input.buttonsPressed.space || gamepad.shoot) {
      const frame = this.app.gameLoop.FrameCount;
      /**
       * Limit frequency of shots.
       */
      if(frame - this.lastShotFrame >= framesBewteenPlayerShots) {
        const spdY = -playerShotSpeed;
        const potentialShots: PotentialShot[] = [
          { x: this.circle.X, y: this.circle.Top, spdX: 0, spdY },
          { x: this.circle.X, y: this.circle.Top, spdX: 1.5, spdY },
          { x: this.circle.X, y: this.circle.Top, spdX: -1.5, spdY },
        ];
        this.app.playerShots.TryShoot(potentialShots);
        this.lastShotFrame = this.app.gameLoop.FrameCount;
      }
    }

    this.bound();
  };
}