import type { App } from "../../App";

import { Enemy } from "./Enemy";
import { enemyJsons } from "./enemyConfigs/enemyJsons";

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
      this.enemies = [];
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
                     this.enemies.push(new Enemy(this.app, enemyJson));
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
}