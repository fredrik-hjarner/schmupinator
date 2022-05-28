import type { App } from "../../App";
import type { PotentialShot } from "../Shots/PotentialShot";
import type { Action } from "./actionTypes";
import type { Vector } from "../../../math/bezier";

import { Circle } from "../../../Circle";
import { ActionExecutor } from "./ActionExecutor";
import { px } from "../../../utils/px";

export class Enemy {
  app: App;
  id: number;
  maxHp: number;
  hp: number;
  circle: Circle;
  speedX: number;
  speedY: number;
  actionExecutor: ActionExecutor;

  /**
   * Public
   */
  constructor(
    app: App,
    { id, origX, origY, hp, actionLists }:
    { id: number,origX: number, origY: number, hp: number, actionLists: Action[][] }
  ) {
    this.app = app;
    this.id = id;
    this.maxHp = hp;
    this.hp = hp;
    this.circle = new Circle(origX, origY, 35, 'red');
    this.actionExecutor = new ActionExecutor({
      actionHandler: this.HandleAction,
      actionLists,
      getFrame: () => app.gameLoop.FrameCount,
      getPosition: this.getPosition,
    });
    this.speedX = 0;
    this.speedY = 0;

    this.updateDisplayHealth();
  }

  Update = () => {
    /**
     * Check if got hit
     */
    const { enemiesThatWereHit } = this.app.collisions.collisions;
    if(enemiesThatWereHit.includes(this.id)) {
      this.hp -= 1;

      /**
       * Display damage.
       * Starts filled with color,
       * border gets successively thinner until they are gone.
       */
      const { style } = this.circle.div;
      const width = parseFloat(style.width);
      const factorHealthLeft = this.hp / this.maxHp;
      style.borderWidth = px(factorHealthLeft * (width/2));

      // Die
      if(this.hp < 1) {
        const enemies = this.app.enemies;
        // remove this enemy.
        enemies.enemies = enemies.enemies.filter(e => e.id !== this.id);
        // TODO: Maybe publish a death event or something.
        return;
      }
    }

    this.applySpeed();
    this.actionExecutor.ProgressOneFrame();
  };

  HandleAction = (action: Action) => {
    switch(action.type) {
      case 'shoot_direction': {
        this.ShootDirection({ dirX: action.dirX, dirY:action.dirY });
        break;
      }

      case 'set_speed': {
        this.SetSpeed({ x: action.x, y: action.y });
        break;
      }

      case 'set_position': {
        this.SetPosition({ x: action.x, y: action.y });
        break;
      }
      
      default:
        console.error(`unknown action type: ${action.type}`);
    }
  };

  ShootDirection = ({ dirX, dirY }: { dirX: number, dirY: number }) => {
    const potentialShots: PotentialShot[] = [
      { x: this.circle.X, y: this.circle.Y, spdX: dirX, spdY: dirY },
    ];
    this.app.enemyShots.TryShoot(potentialShots);
  };

  SetSpeed = ({ x, y }: {x: number, y: number}) => {
    this.speedX = x;
    this.speedY = y;
  };

  SetPosition = ({ x, y }: {x: number, y: number}) => {
    this.circle.X = x;
    this.circle.Y = y;
  };

  /**
   * Private
   */
  applySpeed = () => {
    this.circle.X += this.speedX;
    this.circle.Y += this.speedY;
  };

  getPosition = (): Vector => {
    return { x: this.circle.x, y: this.circle.y };
  };

  updateDisplayHealth = () => {
    const { style } = this.circle.div;
    const width = parseFloat(style.width);
    const factorHealthLeft = this.hp / this.maxHp;
    style.borderWidth = px(factorHealthLeft * (width/2));
  };
}
