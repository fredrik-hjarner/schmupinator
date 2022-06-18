import type { Vector as TVector } from "../../../math/bezier";
import type { App } from "../../App";

import { Enemy } from "./Enemy";
import { TEvent } from "../Events/Events";
import { TShortFormAction } from "./actionTypesShortForms";
import { IEnemyJson } from "./enemyConfigs/IEnemyJson";

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
      /**
       * The "spawner" enemy is not a normal enemy.
       * It can do everything that an enemy can do, but it's
       * primary purpose is to auto-spawn at [0, 0] and
       * be resposible for spawning enemies.
       */
      this.Spawn({ enemy: "spawner", position: { x:0, y: 0 } });

      this.app.events.subscribeToEvent(this.name, this.handleEvent);
   };

   public Spawn = (
      { enemy, flags, position, prependActions=[] }:
      { enemy: string, flags?: string[], position: TVector, prependActions?: TShortFormAction[] }
   ) => {
      const { EnemyJsons } = this.app.yaml;
      // console.log(`Spawn ${enemy} at ${JSON.stringify(position)}`);
      const enemyJson = EnemyJsons.find(e => e.name === enemy);
      if(!enemyJson) {
         alert(`Unknown enemy "${enemy}".`);
         throw new Error(`Unknown enemy "${enemy}".`);
      }
      /**
       * prepend the actions that the parent sent. this allow parent some control over it's spawn.
       * also add die-when-outside-screen behaviour too all spawns.
       * TODO:
       * This is elegant. Maybe add the die-when-outside-screen behaviour in some other way
       */
      const newEnemyJson: IEnemyJson = {
         ...enemyJson,
         actions: [
            {
               type: "parallellRace",
               actionsLists: [
                  [
                     { type: "waitTilInsideScreen" },
                     { type: "waitTilOutsideScreen" },
                     { type: "die" }
                  ],
                  [...prependActions, ...enemyJson.actions]
               ]
            }
         ]
      };
      this.enemies.push(new Enemy(this.app, position, newEnemyJson, flags));
   };

   /**
    * TODO: Push this down into Enemy, so that onFramTick and OnCollisions can be private
    */
   private handleEvent = (event: TEvent) => {
      switch(event.type) {
         // TODO: Should send frameNumber/FrameCount as paybload in frame_tick event.
         case "frame_tick": {
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
         case "collisions":
            this.enemies.forEach(enemy => {
               enemy.OnCollisions(event.collisions);
            });
            break;
      }
   };
}