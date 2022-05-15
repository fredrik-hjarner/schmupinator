import type { App } from "../../App.js";

import { Enemy } from "./Enemy.js";

export class Enemies {
  app: App;
  enemies: Enemy[];

  /**
   * Public
   */
  constructor(app: App, { name }: { name: string }) {
    this.app = app;
    this.name = name;
    // Create all shots
    this.enemies = [
      new Enemy(app, { frameBetweenShots: 60 })
    ];
  }
  
  /**
   * Init runs after bootstrap.
   * If it needs to use things on app dont do that in the constructor
   * since the order on they are added to app makes a difference in
   * that case.
   */
  Init = () => {
    this.app.gameLoop.SubscribeToNextFrame(this.name, this.update);
  };

  /**
   * Private
   */
  update = () => {
    this.enemies.forEach(enemy => {
      enemy.Update();
    });
  };
}