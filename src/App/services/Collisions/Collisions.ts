import type { App } from "../../App";

export type PosAndRadius = {X: number, Y: number, Radius: number };

export type TCollisions = {
  playerWasHit: boolean;
  // List of id:s of enemies that were hit.
  enemiesThatWereHit: string[];
};

export class Collisions {
   app: App;

   /**
   * Public
   */
   constructor(app: App) {
      this.app = app;
   }

   /**
    * Init runs after bootstrap.
    * If it needs to use things on app dont do that in the constructor
    * since the order on they are added to app makes a difference in
    * that case.
    */
   Init = () => {
      // TODO: Use this.name instead!!
      this.app.events.subscribeToEvent(
         "Collisions",
         ({ type }) => {
            if(type === "frame_tick") {
               this.update();
            }
         }
      );
   };

   /**
    * Private
    */
   private update = () => {
      const player = this.app.player;
      const playerShots = this.app.playerShots.shots.map(s => s);
      const enemies = this.app.enemies.enemies;

      const playerWasHit =
         this.calcCircleWasHitByShots({ circle: player, shots: enemies });
      
      const enemiesThatWereHit = enemies.reduce<string[]>((acc, enemy) => {
         const wasHit = this.calcCircleWasHitByShots({ circle: enemy, shots: playerShots });
         return wasHit ? [...acc, enemy.id] : acc;
      }, []);

      // Only send event if there were collisions.
      if (playerWasHit || enemiesThatWereHit.length > 0) {
         const collisions = { playerWasHit, enemiesThatWereHit };
         this.app.events.dispatchEvent({ type: "collisions", collisions });
      }
   };

   private calcCircleWasHitByShots = (
      { circle, shots }: { circle: PosAndRadius, shots: PosAndRadius[] }
   ): boolean => {
      for(let i=0; i<shots.length; i++) {
         const shot = shots[i];
         // Multiplying minDistance if a hack to cause lower hit "box".
         const minDistance = circle.Radius + shot.Radius * 0.8;
         const xDist = circle.X - shot.X;
         const yDist = circle.Y - shot.Y;
         const distance = Math.sqrt(xDist**2 + yDist**2);
         if(distance <= minDistance) {
            return true;
         }
      }
      return false;
   };
}
