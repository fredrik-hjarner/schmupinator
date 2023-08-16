import type { Enemies } from "../Enemies/Enemies";
import type { IEventsCollisions, IGameEvents } from "../Events/IEvents";
import type { IService, TInitParams } from "../IService";
import type { IAttributes } from "../Attributes/IAttributes";

import type { IDestroyable } from "@/utils/types/IDestroyable.ts";

import { collisionsPureFunction } from "./collisionsPureFunction.ts";
// import type { Remote } from "comlink";

// import { wrap, releaseProxy } from "comlink";

import { BrowserDriver } from "../../../drivers/BrowserDriver/index.ts";
// import { resolutionHeight, resolutionWidth } from "@/consts";

type TConstructor = {
   name: string;
}

// const isOutsideOfScreen = (x: number, y: number, radius: number): boolean => {
//    return x < -radius || x > resolutionWidth + radius ||
//       y < -radius || y > resolutionHeight + radius;
// };

// const numberOfWorkers = 1;

export class Collisions implements IService, IDestroyable {
   // vars
   public readonly name: string;
   // adds the time, every frame, it took for collision detection. 
   public accumulatedTime = 0;
   // private workers: Worker[] = [];
   
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
      // for(let i = 0; i < numberOfWorkers; i++) {
      //    this.workers.push(new Worker(
      //       new URL("./collisionsPureFunction.ts", import.meta.url),
      //       { type: "module" }
      //    ));
      // }
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

      const enemiesThatCanCollide = Object.values(this.enemies.enemies)
         .flatMap((enemy) => {
            const collisionType = this.attributes.getAttribute({
               gameObjectId: enemy.id,
               attribute: "collisionType"
            });
            if(collisionType === "none") {
               return [];
            }
            return {
               x: enemy.x,
               y: enemy.y,
               Radius: enemy.Radius,
               id: enemy.id,
               collisionType: collisionType as string
            };
         });

      // const promises = [];
      /**
       * Each worker will take a slice of each.
       */
      // for(let i = 0; i < numberOfWorkers; i++) {
      //    promises.push(new Promise(resolve => {
      //       this.workers[i].onmessage = (e) => {
      //          resolve(e.data);
      //       };
      //       this.workers[i].postMessage({
      //          collidables: enemiesThatCanCollide,
      //          from: Math.floor(enemiesThatCanCollide.length / numberOfWorkers) * i,
      //          to: Math.floor(enemiesThatCanCollide.length / numberOfWorkers) * (i + 1),
      //       });
      //    }));
      // }

      // const results = await Promise.all(promises);

      // // combine results
      // const collisions: TCollisions = {};
      // for(const result of results) {
      //    for(const [key, value] of Object.entries(result)) {
      //       collisions[key] = value;
      //    }
      // }

      const collisions = collisionsPureFunction({
         collidables: enemiesThatCanCollide,
         from: 0,
         to: enemiesThatCanCollide.length
      });

      const endTime = BrowserDriver.PerformanceNow();
      this.accumulatedTime += endTime - startTime;

      // console.log("collisions:", collisions);

      if(Object.keys(collisions).length > 0) {
         this.eventsCollisions.dispatchEvent({ type: "collisions", collisions });
      }
   };

   public destroy = () => {
      // for (const worker of this.workers) {
      //    // worker[releaseProxy]();
      //    worker.terminate();
      // }
   };
}
