import type { App } from "../../App.js";
import type { ShootAction } from "./Enemy.js";

import { enemyShotSpeed } from "../../../consts.js";
import { Enemy } from "./Enemy.js";

// TODO: Move to a better place.
const firstMiniBoss: ShootAction[] = [
  // beam
  { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
  { type: 'wait', frames: 3 },
  { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
  { type: 'wait', frames: 3 },
  { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
  { type: 'wait', frames: 64 - 3 - 3 },
  // triplet
  { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
  { type: 'shoot_direction', dirX: -enemyShotSpeed/Math.SQRT2, dirY: enemyShotSpeed/Math.SQRT2 },
  { type: 'shoot_direction', dirX: enemyShotSpeed/Math.SQRT2, dirY: enemyShotSpeed/Math.SQRT2 },
  { type: 'wait', frames: 64 },
  // triplet
  { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
  { type: 'shoot_direction', dirX: -enemyShotSpeed/Math.SQRT2, dirY: enemyShotSpeed/Math.SQRT2 },
  { type: 'shoot_direction', dirX: enemyShotSpeed/Math.SQRT2, dirY: enemyShotSpeed/Math.SQRT2 },
  { type: 'wait', frames: 64 },
  // TODO: !!!!!
  // { type: "repeat", times: 2, actions: [
  //   { type: 'shoot_direction', dirX: 0, dirY: enemyShotSpeed },
  //   {type:'shoot_direction', dirX: -enemyShotSpeed/Math.SQRT2, dirY: enemyShotSpeed/Math.SQRT2 },
  //   {type:'shoot_direction', dirX: enemyShotSpeed/Math.SQRT2, dirY: enemyShotSpeed/Math.SQRT2 },
  //   { type: 'wait', frames: 64 },
  // ]}
];

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
      new Enemy(app, { shootActions: firstMiniBoss }),
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