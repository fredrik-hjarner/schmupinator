import type { App } from "../../App";

import { Enemy } from "./Enemy";
import { firstMiniBoss1 } from "./enemyConfigs/firstMiniBoss/firstMiniboss1";
import { firstMiniBoss2 } from "./enemyConfigs/firstMiniBoss/firstMiniboss2";

export class Enemies {
  app: App;
  enemies: Enemy[];
  name: string;

  /**
   * Public
   */
  constructor(app: App, { name }: { name: string }) {
    this.app = app;
    this.name = name;
    this.enemies = [
      new Enemy(app, firstMiniBoss1),
      new Enemy(app, firstMiniBoss2),
    ];
  }
  
  /**
   * Init runs after bootstrap.
   * If it needs to use things on app dont do that in the constructor
   * since the order on they are added to app makes a difference in
   * that case.
   */
  Init = () => {
    this.app.events.subscribeToEvent(
      this.name,
      event => {
        switch(event.type) {
          case 'frame_tick':
            this.enemies.forEach(enemy => {
              enemy.OnFrameTick();
            });
            break;
          case 'collisions':
            this.enemies.forEach(enemy => {
              enemy.OnCollisions(event.collisions);
            });
            break;
        }
      }
    );
  };
}