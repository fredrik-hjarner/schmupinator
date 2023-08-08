import type { Enemies } from "../Enemies/Enemies";
import type { IEventsCollisions, IGameEvents } from "../Events/IEvents";
import type { IService, TInitParams } from "../IService";
import type { IAttributes } from "../Attributes/IAttributes";

import { BrowserDriver } from "../../../drivers/BrowserDriver/index.ts";
import { assertString } from "@/utils/typeAssertions.ts";
// import { resolutionHeight, resolutionWidth } from "@/consts";

export type PosAndRadiusAndId = {x: number, y: number, Radius: number, id: string };

/**
 * Object containing all collisions.
 * Keyed by gameObjectId.
 * The value is an array of `collisionTypes` that the gameObjects it collided with have.
 */
export type TCollisions = {
   [gameObjectId: string]: string[];
};

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

      // variable in which to store all collisions. TODO: Update comment.
      const collisions: TCollisions = {};

      const enemiesThatCanCollide = Object.values(this.enemies.enemies)
         .filter((enemy) => {
            const collisionType = this.attributes.getAttribute({
               gameObjectId: enemy.id,
               attribute: "collisionType"
            });
            return collisionType !== "none";
         });

      for (const enemy1 of enemiesThatCanCollide) {
         // const attrValue = this.attributes.getAttribute({
         //    gameObjectId: enemy.id,
         //    attribute: "collisionType"
         // });
         
         collisions[enemy1.id] = [];

         for( const enemy2 of enemiesThatCanCollide) {
            if(enemy1.id === enemy2.id) {
               continue; // dont check collision with self.
            }

            const collided = this.calcCollision({
               doesThis: enemy1,
               collideWithThis: enemy2
            });

            if(collided) {
               const collisionType = assertString(
                  this.attributes.getAttribute({
                     gameObjectId: enemy2.id,
                     attribute: "collisionType"
                  })
               );
               collisions[enemy1.id] = [...new Set(
                  [...collisions[enemy1.id], collisionType]
               )];
            }
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
         collisions[player.id] = true;
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
         collisions[player.id] = true;
      }
         
      const endTime = BrowserDriver.PerformanceNow();
      this.accumulatedTime += endTime - startTime;

      // console.log("collisions:", collisions);

      if(Object.keys(collisions).length > 0) {
         this.eventsCollisions.dispatchEvent({ type: "collisions", collisions });
      }
   };

   /**
    * TODO: cirlce and shots are outdated names.
    * What is checked is if "circle" collides with any of the "shots", if so the return which "shot"
    * "circle" collided with.
    */
   private calcCollision = (
      params: { doesThis: PosAndRadiusAndId, collideWithThis: PosAndRadiusAndId }
   ): boolean => {
      const { doesThis, collideWithThis } = params;
      
      // Multiplying minDistance if a hack to cause lower hit "box".
      const minDistance = doesThis.Radius + collideWithThis.Radius * 0.8;
      const xDist = doesThis.x - collideWithThis.x;
      const yDist = doesThis.y - collideWithThis.y;
      const distance = Math.hypot(xDist, yDist);
      if(distance <= minDistance) {
         return true;
      }

      return false;
   };
}
