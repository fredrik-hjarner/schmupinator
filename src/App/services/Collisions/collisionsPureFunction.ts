// import { expose } from "comlink";

type NumberArray =
   Float32Array |
   Float64Array |
   Int8Array |
   Int16Array |
   Int32Array |
   Uint8Array |
   Uint16Array |
   Uint32Array |
   Uint8ClampedArray;

export type TCollidable = {
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

export type TCollisionsPureFunction = typeof collisionsPureFunction;

export type TCollisionsPureFunctionParams = {
   // TODO: Comment.
   xArray: NumberArray;
   // TODO: Comment.
   yArray: NumberArray;
   // TODO: Comment.
   radiusArray: NumberArray;
   collidables: TCollidable[],
   // TODO: Comment.
   from: number, // inclusive
   to: number, // exclusive
   // TODO: Comment
   total: number;
}

export const collisionsPureFunction = ({
   xArray,
   yArray,
   radiusArray,
   collidables,
   from,
   to,
   total,
}: TCollisionsPureFunctionParams): TCollisions => {
   const collisions: TCollisions = {};

   // for (const collidable1 of collidables) {
   for (let i = from; i < to; i++) {
      const collidable1 = collidables[i];
      const x1 = xArray[i];
      const y1 = yArray[i];
      const radius1 = radiusArray[i];
      collisions[collidable1.id] = [];

      for(let j = 0; j < total; j++) {
         const collidable2 = collidables[j];
         const x2 = xArray[j];
         const y2 = yArray[j];
         const radius2 = radiusArray[j];

         if(collidable1.id === collidable2.id) {
            continue; // dont check collision with self.
         }

         let collided = false;
         // Multiplying minDistance if a hack to cause lower hit "box".
         const minDistance = radius1 + radius2 * 0.8;
         const xDist = x1 - x2;
         const yDist = y1 - y2;
         const distance = Math.hypot(xDist, yDist);
         if(distance <= minDistance) {
            collided = true;
         }

         if(collided) {
            collisions[collidable1.id] = [...new Set(
               [...collisions[collidable1.id], collidable2.collisionType]
            )];
         }
      }
   }

   return collisions;
};

if(typeof onmessage !== "undefined") {
   onmessage = (e) => {
      const collisions = collisionsPureFunction(e.data);
      postMessage(collisions);
   };
}

// expose(collisionsPureFunction);