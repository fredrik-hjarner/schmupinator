import type { Enemies } from "../Enemies/Enemies";
import type { IEventsCollisions, IGameEvents } from "../Events/IEvents";
import type { IService, TInitParams } from "../IService";
import type { Enemy } from "../Enemies/Enemy";
import type { IAttributes } from "../Attributes/IAttributes";

import { BrowserDriver } from "../../../drivers/BrowserDriver";
// import { resolutionHeight, resolutionWidth } from "@/consts";

export type PosAndRadiusAndId = {x: number, y: number, Radius: number, id: string };

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

// const isOutsideOfScreen = (x: number, y: number, radius: number): boolean => {
//    return x < -radius || x > resolutionWidth + radius ||
//       y < -radius || y > resolutionHeight + radius;
// };

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
      /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
      // TODO: Better type checking.
      this.events = deps?.events!;
      this.eventsCollisions = deps?.eventsCollisions!;
      this.enemies = deps?.enemies!;
      this.attributes = deps?.attributes!;
      /* eslint-enable @typescript-eslint/no-non-null-asserted-optional-chain */
      
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

      const allGameObjectsThatWereHit: TCollisions["enemiesThatWereHit"] = [];

      const enemies: Enemy[] = [];
      const enemyBullets: Enemy[] = [];
      const playerBullets: Enemy[] = [];

      for (const enemy of Object.values(this.enemies.enemies)) {
         // If a GameObject is outside of the screen we don't bother to do collision detection.
         // if(isOutsideOfScreen(enemy.x, enemy.y, enemy.Radius)) {
         //    return;
         // }
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
            default:
               // NOOP
         }
      }

      const player = this.enemies.player;

      // Observe: by enemy and not by enemy bullets.
      const playerWasHitByEnemy =
         this.calcCollisions({
            doesThis: player,
            collideWithThese: enemies
         }).collided;

      if(playerWasHitByEnemy) {
         allGameObjectsThatWereHit.push(player.id);
      }
      
      const enemiesHitByPlayerBullets: string[] = [];
      for(const enemy of enemies) {
         const collision = this.calcCollisions({
            doesThis: enemy,
            collideWithThese: playerBullets
         });
         // adds both the "enemy" and what it collides with (for example a playerBullet).
         if(collision.collided) {
            enemiesHitByPlayerBullets.push(enemy.id, collision.collidedWithId);
         }
      }

      const enemyBulletsThatHitPlayer: string[] = [];
      for(const enemyBullet of enemyBullets) {
         const collision = this.calcCollisions({
            doesThis: enemyBullet,
            collideWithThese: [player]
         });
         if(collision.collided) {
            enemyBulletsThatHitPlayer.push(enemyBullet.id);
         }
      }

      if(enemyBulletsThatHitPlayer.length > 0) {
         // if a bullet hit the player then the player was hit...
         allGameObjectsThatWereHit.push(player.id);
      }

      const endTime = BrowserDriver.PerformanceNow();
      this.accumulatedTime += endTime - startTime;

      allGameObjectsThatWereHit.push(...enemiesHitByPlayerBullets);

      allGameObjectsThatWereHit.push(...enemyBulletsThatHitPlayer);

      if(allGameObjectsThatWereHit.length > 0) {
         const collisions = {
            enemiesThatWereHit: [...new Set(allGameObjectsThatWereHit)] // remove duplicates.
         };
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
      
      for(const shot of collideWithThese) {
         // Multiplying minDistance if a hack to cause lower hit "box".
         const minDistance = doesThis.Radius + shot.Radius * 0.8;
         const xDist = doesThis.x - shot.x;
         const yDist = doesThis.y - shot.y;
         const distance = Math.sqrt(xDist**2 + yDist**2);
         if(distance <= minDistance) {
            return { collided: true, collidedWithId: shot.id };
         }
      }
      return { collided: false };
   };
}
