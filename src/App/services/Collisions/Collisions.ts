import type { Circle } from "../../../Circle";
import type { App } from "../../App";

type TCollisions = {
  playerWasHit: boolean;
  // List of id:s of enemies that were hit.
  enemiesThatWereHit: number[];
};

export class Collisions {
  app: App;
  collisions: TCollisions;

  /**
   * Public
   */
  constructor(app: App) {
    this.app = app;
    this.collisions = {
      playerWasHit: false,
      enemiesThatWereHit: []
    };
  }

  /**
   * Init runs after bootstrap.
   * If it needs to use things on app dont do that in the constructor
   * since the order on they are added to app makes a difference in
   * that case.
   */
  Init = () => {
    // TODO: Use this.name instead!!
    this.app.gameLoop.SubscribeToNextFrame("Collisions", this.update);
  };
  
  /**
     * Private
     */
  update = () => {
    const player = this.app.player.circle;
    const playerShots = this.app.playerShots.shots.map(s => s.circle);
    const enemyShots = this.app.enemyShots.shots.map(s => s.circle);
    const enemies = this.app.enemies.enemies;
    /**
     * TODO: This is just temporary.
     * What should happen is that a collision update event
     * should happen which can be subscribed to.
     * I need to make an Events service to add on app.
     */
    const playerWasHit = this.calcCircleWasHitByShots({ circle: player, shots: enemyShots });
    const enemiesThatWereHit = enemies.reduce<number[]>((acc, enemy) => {
      const wasHit = this.calcCircleWasHitByShots({ circle: enemy.circle, shots: playerShots });
      return wasHit ? [...acc, enemy.id] : acc;
    }, []);

    this.collisions = {
      playerWasHit,
      enemiesThatWereHit
    };
  };


  calcCircleWasHitByShots = (
    { circle, shots }: { circle: Circle, shots: Circle[] }
  ): boolean => {
    for(let i=0; i<shots.length; i++) {
      const shot = shots[i];
      // Multiplying minDistance if a hack to cause lower hit "box".
      const minDistance = circle.Radius + shot.Radius * 0.8;
      const xDist = circle.x - shot.x;
      const yDist = circle.y - shot.y;
      const distance = Math.sqrt(xDist**2 + yDist**2);
      if(distance <= minDistance) {
        return true;
      }
    }
    return false;
  };
}
