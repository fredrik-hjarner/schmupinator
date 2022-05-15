import type { App } from "../../App.js";
import type { PotentialShot } from "./PotentialShot.js";

import { resolutionWidth } from "../../../consts.js";

import { Shot } from "./Shot.js";

export class Shots {
  app: App;
  name: string;
  maxShots: number;
  shots: Shot[];

  /**
   * Public
   */
  constructor(app: App,{ name, maxShots }: { name: string, maxShots: number }) {
    this.app = app;
    this.name = name;
    this.maxShots = maxShots;
    // Create all shots
    this.shots = Array(maxShots).fill(0).map((_, i) =>
      new Shot({
        x: resolutionWidth + 10 + 3,
        y: 10 + 3 + i*6,
        spdX: 0,
        spdY: 0,
        active: false,
        color: 'aqua'
      })
    );
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

  TryShoot = (newShots: PotentialShot[]): boolean => {
    const nrActiveShots = this.shots.filter(s => s.active).length;
    const nr = newShots.length;
    if(nrActiveShots + nr > this.maxShots) {
      return false;
    }
    const inactiveShots = this.shots.filter(s => !s.active);
    // Turn inactive shots into active shots.
    newShots.forEach((newShot, i) => { // TODO: should be specific function.
      inactiveShots[i].circle.X = newShot.x;
      inactiveShots[i].circle.Y = newShot.y;
      inactiveShots[i].spdX = newShot.spdX;
      inactiveShots[i].spdY = newShot.spdY;
      inactiveShots[i].active = true;
    });
    return true;
  };

  /**
   * Private
   */
  update = () => {
    this.shots.forEach(shot => {
      shot.Update();
    });
  };
}