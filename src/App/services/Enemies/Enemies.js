import type { App } from "../../App.js";

import { firstMiniBossShootActions } from "./enemies/firstMiniBoss/shootActions.js";
import {
  firstMiniBossMoveActions1,
  firstMiniBossMoveActions2
} from "./enemies/firstMiniBoss/moveActions.js";
import { resolutionWidth } from "../../../consts.js";
import { Enemy } from "./Enemy.js";
import { uuid } from "../../../utils/uuid.js";

export class Enemies {
  app: App;
  enemies: Enemy[];

  /**
   * Public
   */
  constructor(app: App, { name }: { name: string }) {
    this.app = app;
    this.name = name;
    this.enemies = [
      new Enemy(app, {
        id: uuid(),
        origX: resolutionWidth*0.333,
        origY: -20,
        actionLists: [
          firstMiniBossShootActions,
          firstMiniBossMoveActions1
        ]
      }),
      new Enemy(app, {
        id: uuid(),
        origX: resolutionWidth*0.666,
        origY: -20,
        actionLists: [
          firstMiniBossShootActions,
          firstMiniBossMoveActions2
        ]
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