import type { Enemies } from "../Enemies/Enemies";
import type { IEventsCollisions, IGameEvents } from "../Events/IEvents";
import type { IService, TInitParams } from "../IService";
import type { Enemy } from "../Enemies/Enemy";
import type { IAttributes } from "../Attributes/IAttributes";

import { BrowserDriver } from "../../../drivers/BrowserDriver";

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
   // adds the time, every frame, it took for collision detection. 
   public accumulatedTime = 0;
   
   // deps/services
   private events!: IGameEvents;
   private eventsCollisions!: IEventsCollisions;
   private enemies!: Enemies;
   private attributes!: IAttributes;

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
      this.eventsCollisions = deps?.eventsCollisions as IEventsCollisions;
      this.enemies = deps?.enemies as Enemies;
      this.attributes = deps?.attributes as IAttributes;
      
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
      const startTime = BrowserDriver.PerformanceNow();

      const enemies: Enemy[] = [];
      const enemyBullets: Enemy[] = [];
      const playerBullets: Enemy[] = [];

      this.enemies.enemies.forEach(enemy => {
         const attrValue = this.attributes.getAttribute({
            gameObjectId: enemy.id,
            attribute: "collisionType"
         });
         switch(attrValue){
            case "enemy":
               enemies.push(enemy);
               break;
            case "enemyBullet":
               enemyBullets.push(enemy);
               break;
            case "playerBullet":
               playerBullets.push(enemy);
               break;
         }
      });

      const killsPlayerOnCollision = [...enemyBullets, ...enemies];

      const player = this.enemies.player;

      const playerWasHit =
         this.calcCollisions({
            doesThis: player,
            collideWithThese: killsPlayerOnCollision
         }).collided;

      if(playerWasHit) {
         const collisions = { enemiesThatWereHit: [player.id] };
         this.eventsCollisions.dispatchEvent({ type: "collisions", collisions });
      }
      
      const enemiesThatWereHit = enemies.reduce<string[]>((acc, enemy) => {
         const collision = this.calcCollisions({
            doesThis: enemy,
            collideWithThese: playerBullets
         });
         // adds both the "enemy" and what it collides with (for example a playerBullet).
         return collision.collided ? [...acc, enemy.id, collision.collidedWithId] : acc;
      }, []);

      const endTime = BrowserDriver.PerformanceNow();
      this.accumulatedTime += endTime - startTime;

      // Only send event if there were collisions.
      if (enemiesThatWereHit.length > 0) {
         const collisions = { enemiesThatWereHit };
         this.eventsCollisions.dispatchEvent({ type: "collisions", collisions });
      }
   };

   /**
    * TODO: cirlce and shots are outdated names.
    * What is checked is if "circle" collides with any of the "shots", if so the return which "shot"
    * "circle" collided with.
    */
   private calcCollisions = (
      params: { doesThis: PosAndRadiusAndId, collideWithThese: PosAndRadiusAndId[] }
   ): TCalcCollisionsResult => {
      const { doesThis, collideWithThese } = params;
      
      for(let i=0; i<collideWithThese.length; i++) {
         const shot = collideWithThese[i];
         // Multiplying minDistance if a hack to cause lower hit "box".
         const minDistance = doesThis.Radius + shot.Radius * 0.8;
         const xDist = doesThis.X - shot.X;
         const yDist = doesThis.Y - shot.Y;
         const distance = Math.sqrt(xDist**2 + yDist**2);
         if(distance <= minDistance) {
            return { collided: true, collidedWithId: shot.id };
         }
      }
      return { collided: false };
   };
}
