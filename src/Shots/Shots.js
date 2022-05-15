import type { App } from "../App/App";
import type { Shot } from "./Shot";

export class Shots {
  app: App;
  shots: Shot[];

  /**
   * Public
   */
  constructor(app: App) {
    this.app = app;
    this.shots = [];
  }
  
  /**
   * Init runs after bootstrap.
   * If it needs to use things on app dont do that in the constructor
   * since the order on they are added to app makes a difference in
   * that case.
   */
  Init = () => {
    this.app.gameLoop.SubscribeToNextFrame("Shots", this.update);
  };

  AddShotToShots = (shot: Shot) => {
    // Shot's constructor links itself to Shots.
    this.shots.push(shot);
  };

  RemoveShotFromShots = (shot: Shot) => {
    // Shot.destroy unlinks itself from Shots.
    this.shots.filter(s => s !== shot); // reference equality.
  };

  /**
   * Private
   */
  update = () => {
    this.shots.forEach(shot => { shot.Update(); });
  };
}