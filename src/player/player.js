import type { App } from "../App.js";

import { playerSpeedPerFrame, resolutionHeight, resolutionWidth } from "../consts.js";

export class Player {
  /**
   * Public
   */
  constructor(app: App) {
    this.app = app;
    this.position = { x: 100, y: 100 };
    this.diameter = 20;
    this.radius = this.diameter/2;

    // TODO: Move this shit, maybe
    const initPlayerDiv = () => {
      const playerDiv: HTMLDivElement = window.document.querySelector("#player");
      playerDiv.style.position = "fixed";
      playerDiv.style.backgroundColor = "blue";
      playerDiv.style.width = `${this.diameter}px`;
      playerDiv.style.height = `${this.diameter}px`;
      playerDiv.style.top = `${this.top}px`;
      playerDiv.style.left = `${this.left}px`;
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
  get top(){ return this.position.y - this.radius; }
  set top(v){ this.position.y = v + this.radius; }

  get bottom(){ return this.position.y + this.radius; }
  set bottom(v){ this.position.y = v - this.radius; }

  get left(){ return this.position.x - this.radius; }
  set left(v){ this.position.x = v + this.radius; }

  get right(){ return this.position.x + this.radius; }
  set right(v){ this.position.x = v - this.radius; }

  bound = () => {
    if(this.left < 0) {
      this.left = 0;
    } else if(this.right > resolutionWidth) {
      this.right = resolutionWidth;
    }
    if(this.top < 0) {
      this.top = 0;
    } else if (this.bottom > resolutionHeight) {
      this.bottom = resolutionHeight;
    }
  };

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

    this.bound();

    this.playerDiv.style.top = `${this.top}px`;
    this.playerDiv.style.left = `${this.left}px`;
  };
}