import type { App } from "../../App.js";
import type { PotentialShot } from "../Shots/PotentialShot.js";
import type { Action } from "../../../enemies/actionTypes.js";

import { resolutionWidth } from "../../../consts.js";
import { Circle } from "../../../Circle.js";

export class Enemy {
  app: App;
  circle: Circle;
  speedX: number;
  speedY: number;
  shootActions: Action[];
  shootGenerator: Generator<void, void, void>;
  moveGenerator: Generator<void, void, void>;

  /**
   * Public
   */
  constructor(
    app: App,
    { shootActions, moveActions }: { shootActions: Action[], moveActions: Action[] }
  ) {
    this.app = app;
    this.circle = new Circle(resolutionWidth/2, 20, 20, 'red');
    this.shootGenerator = generator(app, shootActions, this.HandleAction);
    this.moveGenerator = generator(app, moveActions, this.HandleAction);
    this.speedX = 0;
    this.speedY = 0;
  }

  Update = () => {
    this.applySpeed();
    this.shootGenerator.next();
    this.moveGenerator.next();
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

  /**
   * Private
   */
  applySpeed = () => {
    this.circle.X += this.speedX;
    this.circle.Y += this.speedY;
  };
}

function* generator(
  app: App, actions: Action[], actionHandler: (Action) => void
): Generator<void, void, void> {
  let currIndex = 0;
  const nrActions = actions.length;

  // while(true) {
  while(currIndex < nrActions) { // if index 1 & nr 2 => kosher
    const currAction = actions[currIndex];
    switch(currAction.type) {
      // wait
      case 'wait': {
        // console.log('wait');
        const waitUntil = app.gameLoop.FrameCount + currAction.frames;
        while(app.gameLoop.FrameCount < waitUntil) {
          yield;
        }
        // console.log('finished waiting');
        break;
      }

      default:
        actionHandler(currAction);
    }
    currIndex++;
    if(currIndex >= nrActions) { // index 1+1 & nr 2 => not kosher
      currIndex = 0; // start from beginning.
    }
  }
}