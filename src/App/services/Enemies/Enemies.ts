import type { Vector as TVector } from "../../../math/bezier";
import type { IService, TInitParams } from "../IService";
import type { GameData } from "../GamaData/GameData";
import type { IEnemyJson } from "./enemyConfigs/IEnemyJson";
import type {
   IEventsCollisions, IEventsPoints, IGameEvents, TCollisionsEvent, TGameEvent
} from "../Events/IEvents";
import type { IGraphics } from "../Graphics/IGraphics";
import type { GamePad } from "../GamePad/GamePad";
import type { IInput } from "../Input/IInput";
import type { Settings } from "../Settings/Settings";
import type { TAction } from "./actions/actionTypes";

import { Enemy } from "./Enemy";

export class Enemies implements IService {
   public readonly name: string;
   public enemies: Enemy[];
   // Just so that player does not have to be found every time.
   private memoizedPlayer?: Enemy;

   // deps/services
   private gameData!: GameData;
   public events!: IGameEvents;
   public eventsCollisions!: IEventsCollisions;
   public eventsPoints!: IEventsPoints;
   public graphics!: IGraphics;
   public input!: IInput;
   public gamepad!: GamePad;
   public settings!: Settings;

   /**
    * Public
    */
   public constructor({ name }: { name: string }) {
      this.name = name;
      this.enemies = [];
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
      this.eventsPoints = deps?.eventsPoints as IEventsPoints;
      this.gameData = deps?.gameData as GameData;
      this.graphics = deps?.graphics as IGraphics;
      this.input = deps?.input as IInput;
      this.gamepad = deps?.gamepad as GamePad;
      this.settings = deps?.settings as Settings;

      this.events.subscribeToEvent(this.name, this.handleEvent);
      this.eventsCollisions.subscribeToEvent(this.name, this.handleEvent);
   };

   public Spawn = (
      { enemy, position, prependActions=[] }:
      { enemy: string, position: TVector, prependActions?: TAction[] }
   ) => {
      // console.log(`Enemies.Spawn: enemy: ${enemy}`);
      // console.log(`Spawn ${enemy} at ${JSON.stringify(position)}`);
      const enemyJson = this.gameData.GetEnemy(enemy);
      // console.log(`Enemies.Spawn: enemyJson.name: ${enemyJson.name}`);

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
               type: "fork",
               actions: [
                  { type: "waitTilInsideScreen" },
                  { type: "waitTilOutsideScreen" },
                  { type: "despawn" }
               ]
            },
            ...prependActions,
            ...enemyJson.actions
         ]
      };
      // console.log(`Enemies.Spawn: newEnemyJson.name: ${newEnemyJson.name}`);
      // console.log(
      //    `Enemies.Spawn: enemies before push: ${this.enemies.map(e => e.id).toString()}`
      // );
      /**
       * TODO: There "used to" be is a bug here.
       * What can happen is that an Enemy's constructor executes a bunch of code that never fully
       * completes. The consequence is that the enemy is never added to the enemies array!!!!
       * 
       * "Fixed" by moving the OnFrameTick() call to after the push (used to be called at end of
       * Enemy's constructor).
       */
      const newEnemyInstance = new Enemy(this, position, newEnemyJson);
      this.enemies.push(newEnemyInstance);
      // console.log(
      //    `Enemies.Spawn: enemies after push: ${this.enemies.map(e => e.id).toString()}`
      // );
      // Execute one frame. This is important if the enemy has some initialization that it needs
      // have to have run, otherwise initialization (with actions) would be delayed one frame from
      // being constructed/added via constructor.
      newEnemyInstance.OnFrameTick();
   };

   public get player(): Enemy {
      if(this.memoizedPlayer !== undefined) {
         return this.memoizedPlayer;
      }

      const player = this.enemies.find(e =>
         e.attrs.GetAttribute("collisionType").value as string === "player"
      );
      if(player === undefined) {
         throw new Error("Enemies.getPlayer: Player was not found");
      }
      this.memoizedPlayer = player;
      return player;
   }

   // TODO: Push this down into Enemy, so that onFramTick and OnCollisions can be private
   private handleEvent = (event: TGameEvent | TCollisionsEvent) => {
      switch(event.type) {
         // TODO: Should send frameNumber/FrameCount as paybload in frame_tick event.
         case "frame_tick": {
            /**
             * Spawn the spawner on the first frame
             */
            if(event.frameNr === 1) {
               /**
                * The "spawner" enemy is not a normal enemy.
                * It can do everything that an enemy can do, but it's
                * primary purpose is to auto-spawn at [0, 0] and
                * be resposible for spawning enemies.
                */
               this.Spawn({ enemy: "spawner", position: { x:0, y: 0 } });
            }

            /**
             * TODO: Here we see that the first tick happens immediately at spawn so I could,
             * if I wanted to, actually set everything in the actions as actions such as set
             * hp, set_position etc. Dunno if I want to do it like that though.
             */
            // console.log(`Enemies.tick: enemies:`, this.enemies.map(e => e.id));
            this.enemies.forEach(enemy => {
               enemy.OnFrameTick();
            });
            break;
         }
         case "collisions":
            event.collisions.enemiesThatWereHit.forEach(enemyId => {
               // TODO: I would not have to "find" if enemies was obj keyed by enemy.id
               const enemy = this.enemies.find(e => e.id === enemyId);
               if(enemy) {
                  enemy.OnCollision();
               }
            });
            break;
      }
   };
}