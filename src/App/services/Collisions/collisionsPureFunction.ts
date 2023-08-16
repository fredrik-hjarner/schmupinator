// import { expose } from "comlink";

export type TCollidable = {
   x: number,
   y: number,
   Radius: number,
   id: string,
   collisionType: string;
};

/**
 * Object containing all collisions.
 * Keyed by gameObjectId.
 * The value is an array of `collisionTypes` that the gameObjects it collided with have.
 */
export type TCollisions = {
   [gameObjectId: string]: string[];
};

/**
 * TODO: cirlce and shots are outdated names.
 * What is checked is if "circle" collides with any of the "shots", if so the return which "shot"
 * "circle" collided with.
 */
const calcCollision = (
   params: { doesThis: TCollidable, collideWithThis: TCollidable }
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

export type TCollisionsPureFunction = typeof collisionsPureFunction;

export const collisionsPureFunction = (
   { collidables, from, to }:
   { collidables: TCollidable[], from: number, to: number }
): TCollisions => {
   const collisions: TCollisions = {};

   // for (const collidable1 of collidables) {
   for (let i = from; i < to; i++) {
      const collidable1 = collidables[i];
      collisions[collidable1.id] = [];

      for( const collidable2 of collidables) {
         if(collidable1.id === collidable2.id) {
            continue; // dont check collision with self.
         }

         const collided = calcCollision({
            doesThis: collidable1,
            collideWithThis: collidable2
         });

         if(collided) {
            collisions[collidable1.id] = [...new Set(
               [...collisions[collidable1.id], collidable2.collisionType]
            )];
         }
      }
   }

   return collisions;
};

// onmessage = (e) => {
//    const collisions = collisionsPureFunction(e.data);
//    postMessage(collisions);
// };

// expose(collisionsPureFunction);