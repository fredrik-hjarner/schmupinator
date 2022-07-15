import type { Enemies } from "../Enemies/Enemies";
import type { IGameEvents } from "../Events/IEvents";
import type { IService, TInitParams } from "../IService";

import { playerInvincible } from "../../../consts";

export type PosAndRadiusAndId = {X: number, Y: number, Radius: number, id: string };

export type TCollisions = {
   // List of id:s of enemies that were hit.
   enemiesThatWereHit: string[];
};

type TCalcCollisionsResult =
   { collided: true, collidedWithId: string } |
   { collided: false };

type TConstructor = {
   name: string;
}

export class Collisions implements IService {
   // vars
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
         .filter(e => e.attrs.GetAttribute("collisionType").value === "enemy");
      const enemyBullets = this.enemies.enemies
         .filter(e => e.attrs.GetAttribute("collisionType").value === "enemyBullet");
      const killsPlayerOnCollision = [...enemyBullets, ...enemies];
      const playerBullets = this.enemies.enemies
         .filter(e => e.attrs.GetAttribute("collisionType").value === "playerBullet");
      const player = this.enemies.player;

      const playerWasHit =
         this.calcCollisions({ circle: player, shots: killsPlayerOnCollision }).collided;
      if(playerWasHit && !playerInvincible) {
         // TODO: This is a bit ugly.
         this.events.dispatchEvent({ type: "player_died" });
      }
      
      // TODO: Also remove the bullets that collided here.
      const enemiesThatWereHit = enemies.reduce<string[]>((acc, enemy) => {
         const collision = this.calcCollisions({
            circle: enemy,
            shots: playerBullets
         });
         return collision.collided ? [...acc, enemy.id, collision.collidedWithId] : acc;
      }, []);

      // Only send event if there were collisions.
      if (enemiesThatWereHit.length > 0) {
         const collisions = { enemiesThatWereHit };
         this.events.dispatchEvent({ type: "collisions", collisions });
      }
   };

   private calcCollisions = (
      { circle, shots }: { circle: PosAndRadiusAndId, shots: PosAndRadiusAndId[] }
   ): TCalcCollisionsResult => {
      for(let i=0; i<shots.length; i++) {
         const shot = shots[i];
         // Multiplying minDistance if a hack to cause lower hit "box".
         const minDistance = circle.Radius + shot.Radius * 0.8;
         const xDist = circle.X - shot.X;
         const yDist = circle.Y - shot.Y;
         const distance = Math.sqrt(xDist**2 + yDist**2);
         if(distance <= minDistance) {
            return { collided: true, collidedWithId: shot.id };
         }
      }
      return { collided: false };
   };
}
