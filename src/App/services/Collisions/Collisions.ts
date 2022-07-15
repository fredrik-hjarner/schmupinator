import type { Enemies } from "../Enemies/Enemies";
import type { IGameEvents } from "../Events/IEvents";
import type { IService, TInitParams } from "../IService";
import type { Player } from "../Player/Player";
import type { Shots } from "../Shots/Shots";

export type PosAndRadius = {X: number, Y: number, Radius: number };

export type TCollisions = {
   playerWasHit: boolean;
   // List of id:s of enemies that were hit.
   enemiesThatWereHit: string[];
};

type TConstructor = {
   name: string;
}

export class Collisions implements IService {
   public readonly name: string;
   
   // deps/services
   private events!: IGameEvents;
   private player!: Player;
   private enemies!: Enemies;
   private playerShots!: Shots;

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
      this.events = deps?.events as IGameEvents;
      this.player = deps?.player as Player;
      this.enemies = deps?.enemies as Enemies;
      this.playerShots = deps?.playerShots as Shots;
      
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
      const player = this.player;
      const playerShots = this.playerShots.shots;
      const enemies = this.enemies.enemies;
      const killsPlayerOnCollision = this.enemies.enemies
         .filter(e => e.attrs.GetAttribute("kills").value === "player");

      const playerWasHit =
         this.calcCircleWasHitByShots({ circle: player, shots: killsPlayerOnCollision });
      
      const enemiesThatWereHit = enemies.reduce<string[]>((acc, enemy) => {
         const wasHit = this.calcCircleWasHitByShots({ circle: enemy, shots: playerShots });
         return wasHit ? [...acc, enemy.id] : acc;
      }, []);

      // Only send event if there were collisions.
      if (playerWasHit || enemiesThatWereHit.length > 0) {
         const collisions = { playerWasHit, enemiesThatWereHit };
         this.events.dispatchEvent({ type: "collisions", collisions });
      }
   };

   private calcCircleWasHitByShots = (
      { circle, shots }: { circle: PosAndRadius, shots: PosAndRadius[] }
   ): boolean => {
      for(let i=0; i<shots.length; i++) {
         const shot = shots[i];
         // Multiplying minDistance if a hack to cause lower hit "box".
         const minDistance = circle.Radius + shot.Radius * 0.8;
         const xDist = circle.X - shot.X;
         const yDist = circle.Y - shot.Y;
         const distance = Math.sqrt(xDist**2 + yDist**2);
         if(distance <= minDistance) {
            return true;
         }
      }
      return false;
   };
}
