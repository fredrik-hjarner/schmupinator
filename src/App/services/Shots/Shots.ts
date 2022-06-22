import type { App } from "../../App";
import type { PotentialShot } from "./PotentialShot";
import type { IService } from "../IService";

import { Shot } from "./Shot";

export class Shots implements IService {
   app: App;
   name: string;
   private maxShots: number;
   private color: string;
   public shots: Shot[];

   /**
    * Public
    */
   constructor(
      app: App, { name, maxShots, color }:
      { name: string, maxShots: number, color: string }
   ) {
      this.app = app;
      this.name = name;
      this.maxShots = maxShots;
      this.color = color;
      this.shots = [];
   }

   /**
    * Init runs after bootstrap.
    * If it needs to use things on app dont do that in the constructor
    * since the order on they are added to app makes a difference in
    * that case.
    */
   // eslint-disable-next-line @typescript-eslint/require-await
   Init = async () => {
      this.app.events.subscribeToEvent(
         this.name,
         ({ type }) => {
            if(type === "frame_tick") {
               this.update();
            }
         }
      );
   };

   TryShoot = (newShots: PotentialShot[]): boolean => {
      const nrActiveShots = this.shots.length;
      const nr = newShots.length;
      if(nrActiveShots + nr > this.maxShots) {
         return false;
      }
      // Turn inactive shots into active shots.
      newShots.forEach((newShot) => { // TODO: should be specific function.
         const { x, y, spdX, spdY } = newShot;
         const shot = new Shot({
            app: this.app, x, y, spdX, spdY, color: this.color, shotsService: this
         }); 
         this.shots.push(shot);
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