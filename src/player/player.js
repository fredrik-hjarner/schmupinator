import type { App } from "../App.js";

import { playerSpeedPerFrame } from "../consts.js";

export class Player {
  /**
   * Public
   */
  constructor(app: App) {
    this.app = app;
    this.position = { x: 100, y: 100 };
    this.radius = 20;

    // TODO: Move this shit, maybe
    const initPlayerDiv = () => {
      const playerDiv: HTMLDivElement = window.document.querySelector("#player");
      playerDiv.style.position = "fixed";
      playerDiv.style.backgroundColor = "blue";
      playerDiv.style.width = `${this.radius}px`;
      playerDiv.style.height = `${this.radius}px`;
      playerDiv.style.top = `${this.position.y}px`;
      playerDiv.style.left = `${this.position.x}px`;
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
  updatePlayer = () => {
    const input = this.app.input;

    const speed = playerSpeedPerFrame[0];

    if (input.buttonsPressed.left) {
      this.position.x -= speed;
    }
    if (input.buttonsPressed.right) {
      this.position.x += speed;
    }
    if (input.buttonsPressed.up) {
      this.position.y -= speed;
    }
    if (input.buttonsPressed.down) {
      this.position.y += speed;
    }

    this.playerDiv.style.top = `${this.position.y}px`;
    this.playerDiv.style.left = `${this.position.x}px`;
  };
}