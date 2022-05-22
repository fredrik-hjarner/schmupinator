import type { Circle } from "../../../Circle";
import type { App } from "../../App";
// import type { Enemy } from "../Enemies/Enemy";

type TCalcCollisionsArgs = {
  player: Circle;
  // playerShots: Circle[];
  // enemies: Enemy[];
  enemyShots: Circle[];
};

type TCalcCollisionsRet = {
  playerWasHit: boolean;
  // List of id:s of enemies that were hit.
  enemiesThatWereHit: number[];
};

export class Collisions {
  app: App;
  collisions: TCalcCollisionsRet;

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
    const enemyShots = this.app.enemyShots.shots.map(s => s.circle);
    /**
     * TODO: This is just temporary.
     * What should happen is that a collision update event
     * should happen which can be subscribed to.
     * I need to make an Events service to add on app.
     */
    this.collisions = this.calcCollisions({ player, enemyShots });
  };

  calcCollisions = ({
    player,
    // playerShots,
    // enemies,
    enemyShots,
  }: TCalcCollisionsArgs): TCalcCollisionsRet => {
    const playerWasHit = this.calcPlayerWasHit({ player, enemyShots });
    return {
      playerWasHit
    };
  };

  calcPlayerWasHit = (
    { player, enemyShots }: { player: Circle, enemyShots: Circle[] }
  ): boolean => {
    for(let i=0; i<enemyShots.length; i++) {
      const shot = enemyShots[i];
      // Multiplying minDistance if a hack to cause lower hit "box".
      const minDistance = player.Radius + shot.Radius * 0.8;
      const xDist = player.x - shot.x;
      const yDist = player.y - shot.y;
      const distance = Math.sqrt(xDist**2 + yDist**2);
      if(distance <= minDistance) {
        return true;
      }
    }
    return false;
  };
}
