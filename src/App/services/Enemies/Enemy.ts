import type { App } from "../../App";
import type { PotentialShot } from "../Shots/PotentialShot";
import type { Action } from "./actionTypes";
import type { Vector } from "../../../math/bezier";

import { Circle } from "../../../Circle";
import { ActionExecutor } from "./ActionExecutor";

export class Enemy {
  app: App;
  id: number;
  circle: Circle;
  speedX: number;
  speedY: number;
  actionExecutor: ActionExecutor;

  /**
   * Public
   */
  constructor(
    app: App,
    { id, origX, origY, actionLists }:
    { id: number,origX: number, origY: number, actionLists: Action[][] }
  ) {
    this.app = app;
    this.id = id;
    this.circle = new Circle(origX, origY, 20, 'red');
    this.actionExecutor = new ActionExecutor({
      actionHandler: this.HandleAction,
      actionLists,
      getFrame: () => app.gameLoop.FrameCount,
      getPosition: this.getPosition,
    });
    this.speedX = 0;
    this.speedY = 0;
  }

  Update = () => {
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
}
