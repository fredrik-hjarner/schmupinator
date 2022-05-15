import type { App } from "../../App";
import type { Shot } from "./Shot";

export class Shots {
  app: App;
  name: string;
  maxShots: number;
  shots: Shot[];

  /**
   * Public
   */
  constructor(app: App,{ name, maxShots = 1000 }: { name: string, maxShots: number }) {
    this.app = app;
    this.name = name;
    this.maxShots = maxShots;
    this.shots = [];
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