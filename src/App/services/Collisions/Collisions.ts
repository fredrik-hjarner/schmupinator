import type { Enemies } from "../Enemies/Enemies";
import type { IEventsCollisions } from "../Events/IEvents";
import type { GameEvents } from "../Events/GameEvents.ts";
import type { IService, TInitParams } from "../IService";
import type { IAttributes } from "../Attributes/IAttributes";
import type { IDestroyable } from "@/utils/types/IDestroyable.ts";
import type { TCollisions, TCollisionsPureFunctionParams } from "./collisionsPureFunction.ts";
// import type { Remote } from "comlink";

// import { collisionsPureFunction } from "./collisionsPureFunction.ts";
// import { wrap, releaseProxy } from "comlink";
import { BrowserDriver } from "../../../drivers/BrowserDriver/index.ts";
import { maxGameObjects } from "@/consts.ts";
// import { resolutionHeight, resolutionWidth } from "@/consts";

type TConstructor = {
   name: string;
}

// const isOutsideOfScreen = (x: number, y: number, radius: number): boolean => {
//    return x < -radius || x > resolutionWidth + radius ||
//       y < -radius || y > resolutionHeight + radius;
// };

const numberOfWorkers = 1;

export class Collisions implements IService, IDestroyable {
   // vars
   public readonly name: string;
   // adds the time, every frame, it took for collision detection. 
   public accumulatedTime = 0;
   // private xArray = [];
   // private yArray = [];
   // private radiusArray = [];
   private xArray = new Float64Array(new SharedArrayBuffer(maxGameObjects * (64 / 8)));
   private yArray = new Float64Array(new SharedArrayBuffer(maxGameObjects * (64 / 8)));
   private radiusArray = new Float64Array(new SharedArrayBuffer(maxGameObjects * (64 / 8)));
   private workers: Worker[] = [];
   
   // deps/services
   private events!: GameEvents;
   private eventsCollisions!: IEventsCollisions;
   private enemies!: Enemies;
   private attributes!: IAttributes;

   /**
   * Public
   */
   public constructor(params: TConstructor) {
      this.name = params.name;
      for(let i = 0; i < numberOfWorkers; i++) {
         this.workers.push(new Worker(
            new URL("./collisionsPureFunction.ts", import.meta.url),
            { type: "module" }
         ));
      }
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
         async ({ type }) => {
            if(type === "frame_tick") {
               await this.update();
            }
         }
      );
   };

   /**
    * Private
    */
   private update = async () => {
      const startTime = BrowserDriver.PerformanceNow();

      // number of gameObjects that can collide, i.e. that have a collisionType that is not "none".
      let gameObjectsCounter = 0;
      const enemiesThatCanCollide = Object.values(this.enemies.enemies)
         .flatMap((enemy) => {
            const collisionType = this.attributes.getAttribute({
               gameObjectId: enemy.id,
               attribute: "collisionType"
            });
            if(collisionType === "none") {
               return [];
            }
            this.xArray[gameObjectsCounter] = enemy.x;
            this.yArray[gameObjectsCounter] = enemy.y;
            this.radiusArray[gameObjectsCounter] = enemy.Radius;
            gameObjectsCounter++; // increment because we added one GameObject/Colldable.
            return {
               id: enemy.id,
               collisionType: collisionType as string
            };
         });

      // /**
      //  * Multi threaded.
      //  */
      const promises = [];
      /**
       * Each worker will take a slice of each.
       */
      for(let i = 0; i < numberOfWorkers; i++) {
         promises.push(new Promise(resolve => {
            this.workers[i].onmessage = (e) => {
               resolve(e.data);
            };
            this.workers[i].postMessage({
               xArray: this.xArray,
               yArray: this.yArray,
               radiusArray: this.radiusArray,
               collidables: enemiesThatCanCollide,
               from: Math.floor(enemiesThatCanCollide.length / numberOfWorkers) * i,
               to: Math.floor(enemiesThatCanCollide.length / numberOfWorkers) * (i + 1),
               total: enemiesThatCanCollide.length,
            } satisfies TCollisionsPureFunctionParams);
         }));
      }

      const results = await Promise.all(promises);

      // combine results
      const collisions: TCollisions = {};
      for(const result of results) {
         // @ts-ignore: TODO: Fix this.
         for(const [key, value] of Object.entries(result)) {
            // @ts-ignore: TODO: Fix this.
            collisions[key] = value;
         }
      }

      /**
       * Single threaded.
       */
      // const collisions = collisionsPureFunction({
      //    xArray: this.xArray,
      //    yArray: this.yArray,
      //    radiusArray: this.radiusArray,
      //    collidables: enemiesThatCanCollide,
      //    from: 0,
      //    to: enemiesThatCanCollide.length,
      //    total: enemiesThatCanCollide.length,
      // });

      const endTime = BrowserDriver.PerformanceNow();
      const diff = endTime - startTime;
      this.accumulatedTime += diff;

      // console.log("collisions:", collisions);

      if(Object.keys(collisions).length > 0) {
         this.eventsCollisions.dispatchEvent({ type: "collisions", collisions });
      }
   };

   public destroy = () => {
      for (const worker of this.workers) {
         // worker[releaseProxy]();
         worker.terminate();
      }
   };
}
