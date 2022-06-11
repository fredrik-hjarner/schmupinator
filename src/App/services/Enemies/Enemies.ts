import type { Vector as TVector } from "../../../math/bezier";
import type { App } from "../../App";

import { Enemy } from "./Enemy";
import { enemyJsons } from "./enemyConfigs/enemyJsons";
// import { spawner } from "./enemyConfigs/spawner/spawner";

export class Enemies {
   app: App;
   enemies: Enemy[];
   name: string;

   /**
    * Public
    */
   constructor(app: App, { name }: { name: string }) {
      this.app = app;
      this.name = name;
      this.enemies = [
         /**
          * The "spawner" enemy is not a normal enemy.
          * It can do everything that an enemy can do, but it's
          * primary purpose is to auto-spawn at [0, 0] and
          * be resposible for spawning enemies.
          */
         // new Enemy(app, spawner)
      ];
   }
  
   /**
    * Init runs after bootstrap.
    * If it needs to use things on app dont do that in the constructor
    * since the order on they are added to app makes a difference in
    * that case.
    */
   Init = () => {
      this.app.events.subscribeToEvent(
         this.name,
         event => {
            switch(event.type) {
               // TODO: Should send frameNumber/FrameCount as paybload in frame_tick event.
               case 'frame_tick': {
                  // TODO: Should get enemyJsons sent in via constructor.
                  const enemiesToSpawn = enemyJsons.filter(enemy =>
                     enemy.spawnOnFrame === this.app.gameLoop.FrameCount
                  );
                  enemiesToSpawn.forEach(enemyJson => {
                     // TODO: Remove enemyJson.startPosition.
                     this.enemies.push(new Enemy(this.app, enemyJson.startPosition, enemyJson));
                  });
                  /**
                   * TODO: Here we see that the first tick happens immediately at spawn so I could,
                   * if I wanted to, actually set everything in the actions as actions such as set
                   * hp, set_position etc. Dunno if I want to do it like that though.
                   */
                  this.enemies.forEach(enemy => {
                     enemy.OnFrameTick();
                  });
                  break;
               }
               case 'collisions':
                  this.enemies.forEach(enemy => {
                     enemy.OnCollisions(event.collisions);
                  });
                  break;
            }
         }
      );
   };

   Spawn = ({ enemy, position }: { enemy: string, position: TVector }) => {
      const enemyJson = enemyJsons.find(e => e.name === enemy);
      if(!enemyJson) {
         throw new Error(`Unknown enemy "${enemy}".`);
      }
      this.enemies.push(new Enemy(this.app, position, enemyJson));
   };
}