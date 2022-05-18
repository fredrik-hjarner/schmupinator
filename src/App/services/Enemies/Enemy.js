import type { App } from "../../App.js";
import type { PotentialShot } from "../Shots/PotentialShot.js";
import type { Action } from "./actionTypes.js";
import type { Vector } from "../../../math/bezier.js";

import { Circle } from "../../../Circle.js";
import { CommandExecutor } from "./CommandExecutor.js";

export class Enemy {
  app: App;
  circle: Circle;
  speedX: number;
  speedY: number;
  shootActions: Action[];
  shootCmdExecutor: Generator<void, void, void>;
  moveCmdExecutor: Generator<void, void, void>;

  /**
   * Public
   */
  constructor(
    app: App,
    { origX, origY, shootActions, moveActions }:
    { origX: number, origY: number, shootActions: Action[], moveActions: Action[] }
  ) {
    this.app = app;
    this.circle = new Circle(origX, origY, 20, 'red');
    this.shootCmdExecutor = CommandExecutor(
      shootActions,
      this.HandleAction,
      () => app.gameLoop.FrameCount,
      this.getPosition
    );
    this.moveCmdExecutor = CommandExecutor(
      moveActions,
      this.HandleAction,
      () => app.gameLoop.FrameCount,
      this.getPosition
    );
    this.speedX = 0;
    this.speedY = 0;
  }

  Update = () => {
    this.applySpeed();
    this.shootCmdExecutor.next();
    this.moveCmdExecutor.next();
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
