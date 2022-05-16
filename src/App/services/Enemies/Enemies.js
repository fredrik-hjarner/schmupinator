import type { App } from "../../App.js";

import { firstMiniBossShootActions } from "../../../enemies/firstMiniBoss/shootActions.js";
import { firstMiniBossMoveActions } from "../../../enemies/firstMiniBoss/moveActions.js";
import { resolutionWidth } from "../../../consts.js";
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
      new Enemy(app, {
        origX: resolutionWidth*0.333,
        origY: 20,
        shootActions: firstMiniBossShootActions,
        moveActions: firstMiniBossMoveActions
      }),
      new Enemy(app, {
        origX: resolutionWidth*0.666,
        origY: 20,
        shootActions: firstMiniBossShootActions,
        moveActions: firstMiniBossMoveActions
      }),
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