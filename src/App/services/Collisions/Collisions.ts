import type { Enemies } from "../Enemies/Enemies";
import type { IGameEvents } from "../Events/IEvents";
import type { IService, TInitParams } from "../IService";

import { playerInvincible } from "../../../consts";

export type PosAndRadius = {X: number, Y: number, Radius: number };

export type TCollisions = {
   playerWasHit: boolean;
   // List of id:s of enemies that were hit.
   enemiesThatWereHit: string[];
};

type TConstructor = {
   name: string;
}

export class Collisions implements IService {
   public readonly name: string;
   
   // deps/services
   private events!: IGameEvents;
   private enemies!: Enemies;

   /**
   * Public
   */
   public constructor(params: TConstructor) {
      this.name = params.name;
   }

   /**
    * Init runs after bootstrap.
    * If it needs to use things on app dont do that in the constructor
    * since the order on they are added to app makes a difference in
    * that case.
    */
   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      this.events = deps?.events as IGameEvents;
      this.enemies = deps?.enemies as Enemies;
      
      this.events.subscribeToEvent(
         this.name,
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
      const enemies = this.enemies.enemies
         .filter(e =>
            ["enemy"].includes(e.attrs.GetAttribute("collisionType").value as string)
         );
      const killsPlayerOnCollision = this.enemies.enemies
         .filter(e =>
            ["enemy", "enemyBullet"].includes(e.attrs.GetAttribute("collisionType").value as string)
         );
      const playerBullets = this.enemies.enemies
         .filter(e =>
            ["playerBullet"].includes(e.attrs.GetAttribute("collisionType").value as string)
         );
      const player = this.enemies.enemies
         .find(e =>
            ["player"].includes(e.attrs.GetAttribute("collisionType").value as string)
         );
      if(player === undefined) {
         throw new Error("Collisions: Player was not found");
      }

      const playerWasHit =
         this.calcCircleWasHitByShots({ circle: player, shots: killsPlayerOnCollision });
      if(playerWasHit && !playerInvincible) {
         // TODO: This is a bit ugly.
         this.events.dispatchEvent({ type: "player_died" });
      }
      
      // TODO: Also remove the bullets that collided here.
      const enemiesThatWereHit = enemies.reduce<string[]>((acc, enemy) => {
         const wasHit = this.calcCircleWasHitByShots({
            circle: enemy,
            shots: playerBullets
         });
         return wasHit ? [...acc, enemy.id] : acc;
      }, []);

      // Only send event if there were collisions.
      if (playerWasHit || enemiesThatWereHit.length > 0) {
         const collisions = { playerWasHit, enemiesThatWereHit };
         this.events.dispatchEvent({ type: "collisions", collisions });
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
