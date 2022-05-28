import type { App } from "../../App";

import { firstMiniBossShootActions } from "./enemyConfigs/firstMiniBoss/shootActions";
import {
  firstMiniBossMoveActions1,
  firstMiniBossMoveActions2
} from "./enemyConfigs/firstMiniBoss/moveActions";
import { resolutionWidth } from "../../../consts";
import { Enemy } from "./Enemy";
import { uuid } from "../../../utils/uuid";

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
      new Enemy(app, {
        id: uuid(),
        origX: resolutionWidth*0.333,
        origY: -20,
        hp: 80,
        actionLists: [
          firstMiniBossShootActions,
          firstMiniBossMoveActions1
        ]
      }),
      new Enemy(app, {
        id: uuid(),
        origX: resolutionWidth*0.666,
        origY: -20,
        hp: 80,
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