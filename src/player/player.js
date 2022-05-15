import type { App } from "../App.js";

import { playerSpeedPerFrame, resolutionHeight, resolutionWidth } from "../consts.js";
import { Circle } from "../Position.js";

export class Player {
  /**
   * Public
   */
  constructor(app: App) {
    this.app = app;
    this.circle = new Circle(100, 100, 20);

    // TODO: Move this shit, maybe
    const initPlayerDiv = () => {
      const playerDiv: HTMLDivElement = window.document.querySelector("#player");
      playerDiv.style.position = "fixed";
      playerDiv.style.backgroundColor = "blue";
      playerDiv.style.width = `${this.circle.Diameter}px`;
      playerDiv.style.height = `${this.circle.Diameter}px`;
      playerDiv.style.top = `${this.circle.Top}px`;
      playerDiv.style.left = `${this.circle.Left}px`;
      playerDiv.style.borderRadius = "5000px";
      return playerDiv;
    };
    this.playerDiv = initPlayerDiv();
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

    this.bound();

    this.playerDiv.style.top = `${this.circle.Top}px`;
    this.playerDiv.style.left = `${this.circle.Left}px`;
  };
}