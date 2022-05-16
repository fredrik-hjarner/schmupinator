import type { App } from "../../App.js";
import type { PotentialShot } from "../Shots/PotentialShot.js";

import {
  playerSpeedPerFrame, resolutionHeight, resolutionWidth
} from "../../../consts.js";
import { Circle } from "../../../Circle.js";

export class Enemy {
  app: App;
  circle: Circle;
  actions: ShootAction[];
  generator: Generator<void, void, void>;

  /**
   * Public
   */
  constructor(app: App, { shootActions }: { shootActions: ShootAction[] }) {
    this.app = app;
    this.circle = new Circle(resolutionWidth/2, 20, 20, 'red');
    this.actions = shootActions;
    this.generator = generator(this);
  }

  Update = () => {
    const input = this.app.input;

    const speed = playerSpeedPerFrame[0];

    if (input.buttonsPressed.left) {
      this.circle.X += speed;
    }
    if (input.buttonsPressed.right) {
      this.circle.X -= speed;
    }
    if (input.buttonsPressed.up) {
      this.circle.Y += speed;
    }
    if (input.buttonsPressed.down) {
      this.circle.Y -= speed;
    }

    this.bound();

    this.generator.next();
  };

  HandleAction = (action: ShootAction) => {
    switch(action.type) {
      case 'shoot_direction': {
        this.ShootDirection({ dirX: action.dirX, dirY:action.dirY });
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

  /**
   * Private
   */
  bound = () => {
    if(this.circle.Left < 0) {
      this.circle.Left = 0;
    } else if(this.circle.Right > resolutionWidth) {
      this.circle.Right = resolutionWidth;
    }
    if(this.circle.Top < 0) {
      this.circle.Top = 0;
    } else if (this.circle.Bottom > resolutionHeight) {
      this.circle.Bottom = resolutionHeight;
    }
  };

}

export type ShootAction =
  { type: "wait", frames: number} |
  { type: "wait_util_frame_nr", framenr: number} |
  { type: "shoot_direction", dirX: number, dirY: number };

/**
 * TODO: Do I need to kill a function generator?
 * How do I do that if needed?
 */
function* generator(enemy: Enemy): Generator<void, void, void> {
  const app = enemy.app;
  const actions = enemy.actions;
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
        enemy.HandleAction(currAction);
    }
    currIndex++;
    if(currIndex >= nrActions) { // index 1+1 & nr 2 => not kosher
      currIndex = 0; // start from beginning.
    }
  }
}