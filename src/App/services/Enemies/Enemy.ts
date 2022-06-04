import type { App } from "../../App";
import type { PotentialShot } from "../Shots/PotentialShot";
import type { TAction } from "./actionTypes";
import type { Vector as TVector } from "../../../math/bezier";
import type { TCollisions } from "../Collisions/Collisions";

import { Circle } from "../../../Circle";
import { ActionExecutor } from "./ActionExecutor";
import { px } from "../../../utils/px";
import { Vector } from "../../../math/Vector";
import { Angle } from "../../../math/Angle";
import { IEnemyJson } from "./enemyConfigs/IEnemyJson";

export class Enemy {
  app: App;
  id: string;
  maxHp: number;
  hp: number;
  circle: Circle;
  speedX: number;
  speedY: number;
  shotSpeed: number;
  actionExecutor: ActionExecutor;

  /**
   * Public
   */
  constructor(
    app: App,
    json: IEnemyJson,
  ) {
    this.app = app;
    this.id = json.name;
    this.maxHp = json.hp;
    this.hp = json.hp;
    this.circle = new Circle(json.startPosition.x, json.startPosition.y, 35, 'red');
    this.shotSpeed = 0.2; // super slow default shot speed, you'll always want to override this.
    this.actionExecutor = new ActionExecutor({
      actionHandler: this.HandleAction,
      actionLists: json.actionsLists,
      getFrame: () => app.gameLoop.FrameCount,
      getPosition: this.getPosition,
    });
    this.speedX = 0;
    this.speedY = 0;

    this.updateDisplayHealth();
  }

  public OnFrameTick = () => {
    this.applySpeed();
    this.actionExecutor.ProgressOneFrame();
  };

  public OnCollisions = (collisions: TCollisions) => {
    /**
     * Check if got hit
     */
    const { enemiesThatWereHit } = collisions;
    if(enemiesThatWereHit.includes(this.id)) {
      this.hp -= 1;

      /**
       * Display damage.
       * Starts filled with color,
       * border gets successively thinner until they are gone.
       */
      const { style } = this.circle.div;
      const width = parseFloat(style.width);
      const factorHealthLeft = this.hp / this.maxHp;
      style.borderWidth = px(factorHealthLeft * (width/2));

      // Die
      if(this.hp < 1) {
        const enemies = this.app.enemies;
        // remove this enemy.
        enemies.enemies = enemies.enemies.filter(e => e.id !== this.id);
        // TODO: Maybe publish a death event or something.
        return;
      }
    }
  };

  /**
   * Essentially maps actions to class methods,
   * that is has very "thin" responsibilities.
   */
  HandleAction = (action: TAction) => {
    switch(action.type) {
      case 'shoot_direction': {
        this.ShootDirection({ dirX: action.dirX, dirY:action.dirY });
        break;
      }

      case 'set_speed': {
        this.SetSpeed({ x: action.x, y: action.y });
        break;
      }

      case 'set_shot_speed': {
        this.SetShotSpeed(action.pixelsPerFrame);
        break;
      }

      case 'set_position': {
        this.SetPosition({ x: action.x, y: action.y });
        break;
      }

      case 'shoot_toward_player': {
        this.ShootTowardPlayer();
        break;
      }

      case 'shoot_beside_player': {
        this.ShootBesidePlayer(action.clockwiseDegrees);
        break;
      }
      
      default:
        console.error(`unknown action type: ${action.type}`);
    }
  };

  ShootDirection = ({ dirX, dirY }: { dirX: number, dirY: number }) => {
    const isZero = dirX === 0 && dirY === 0;
    const pixelsPerFrame = this.shotSpeed;
    const pythagoras = isZero ? 9999 : Math.sqrt(dirX**2 + dirY**2);
    const speedUpFactor = pixelsPerFrame / pythagoras;
    const potentialShots: PotentialShot[] = [
      {
        x: this.circle.X,
        y: this.circle.Y,
        spdX: dirX * speedUpFactor,
        spdY: dirY * speedUpFactor
      },
    ];
    this.app.enemyShots.TryShoot(potentialShots);
  };

  ShootTowardPlayer = () => {
    const player = this.app.player.circle;
    const me = this.circle;
    const dirX = player.x - me.x;
    const dirY = player.y - me.y;
    this.ShootDirection({ dirX, dirY });
  };

  ShootBesidePlayer = (clockwiseDegrees: number) => {
    const player = this.app.player.circle;
    const me = this.circle;
    const dirX = player.x - me.x;
    const dirY = player.y - me.y;
    const vector = new Vector(dirX, dirY).rotateClockwise(Angle.fromDegrees(clockwiseDegrees));
    this.ShootDirection({ dirX: vector.x, dirY: vector.y });
  };

  SetSpeed = ({ x, y }: {x: number, y: number}) => {
    this.speedX = x;
    this.speedY = y;
  };

  SetShotSpeed = (pixelsPerFrame: number) => {
    this.shotSpeed = pixelsPerFrame;
  };

  SetPosition = ({ x, y }: {x: number, y: number}) => {
    this.circle.X = x;
    this.circle.Y = y;
  };

  /**
   * Private
   */
  applySpeed = () => {
    this.circle.X += this.speedX;
    this.circle.Y += this.speedY;
  };

  getPosition = (): TVector => {
    return { x: this.circle.x, y: this.circle.y };
  };

  updateDisplayHealth = () => {
    const { style } = this.circle.div;
    const width = parseFloat(style.width);
    const factorHealthLeft = this.hp / this.maxHp;
    style.borderWidth = px(factorHealthLeft * (width/2));
  };
}
