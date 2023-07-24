import type { TAction } from "./actions/actionTypes";
import type { Vector as TVector } from "../../../math/bezier";
import type { IGraphics, TGraphicsActionWithoutHandle } from "../Graphics/IGraphics";
import type { Enemies } from "./Enemies";
import type { TGameObject } from "../../../gameTypes/TGameObject";

import { ActionType as AT } from "./actions/actionTypes";
import { EnemyActionExecutor } from "./EnemyActionExecutor";
import { Vector } from "../../../math/Vector";
import { Angle } from "../../../math/Angle";
import { UnitVector } from "../../../math/UnitVector";
import { uuid } from "../../../utils/uuid";
import { resolutionHeight, resolutionWidth } from "../../../consts";
import { assertNumber } from "../../../utils/typeAssertions";
import { EnemyGfx } from "./EnemyGfx";

export class Enemy {
   public id: string;
   // public because grabbed in EnemyActionExecutor.
   public enemies: Enemies; // enemies service
   private graphics: IGraphics; // Graphics service
   private diameter: number;
   private speed = 0;
   private shotSpeed = 0.2; // super slow default shot speed, you'll always want to override this.
   // facing/aim
   // default direction down.
   private moveDirection = new UnitVector(new Vector(0, 1));
   private mirrorX = false;
   private mirrorY = false;
   private actionExecutor: EnemyActionExecutor;
   private gfx?: EnemyGfx; // handle to GraphicsElement from Graphics service.
   private name: string;

   public constructor( enemies: Enemies, position: TVector, json: TGameObject ) {
      this.enemies = enemies;
      this.id = `${json.name}-${uuid(json.name)}`;
      this.name = json.name;
      this.diameter = json.diameter;
      this.x = position.x;
      this.y = position.y;
      this.actionExecutor = new EnemyActionExecutor({
         actionHandler: this.HandleAction, // TODO: Remove this line.
         actions: json.actions,
         enemy: this,
         input: this.enemies.input,
         gamepad: this.enemies.gamepad,
      });

      this.graphics = this.enemies.graphics;
      this.gfx = new EnemyGfx({
         diameter: json.diameter, graphics: this.graphics, x: position.x, y: position.y
      });
   }
   private get attrs() { return this.enemies.attributes; } // convenience getter to shorten code.

   private get hp(): number {
      return assertNumber(this.attrs.getAttribute({ gameObjectId: this.id, attribute: "hp" }));
   }
   private set hp(value: number){
      this.attrs.setAttribute({ gameObjectId: this.id, attribute: "hp", value });
   }

   public get x(): number { // get x from attributes
      return this.attrs.getNumber({ gameObjectId: this.id, attribute: "x" });
   }
   public set x(value: number) { // set x attribute
      this.attrs.setAttribute({ gameObjectId: this.id, attribute: "x", value });
   }

   public get y(): number { // get y from attributes
      return this.attrs.getNumber({ gameObjectId: this.id, attribute: "y" });
   }
   public set y(value: number) { // set y attribute
      this.attrs.setAttribute({ gameObjectId: this.id, attribute: "y", value });
   }

   public get Radius(){ return this.diameter/2; }

   public OnFrameTick = () => {
      // console.log(`${this.id} OnFrameTick`);
      /* const done = */ this.actionExecutor.ProgressOneFrame();
      // if(done) { console.log(`${this.name} have no more actions to execute and is fully done`); }
      // if(done) { this.die(); }

      // Safest to do all the required updates n shit here, even if hp etc have not been changed.
      if(this.attrs.getAttribute({ gameObjectId: this.id, attribute: "boundToWindow" })) {
         this.boundToWindow();
      }
      this.gfx?.setPosition({ x: this.x, y: this.y });
      // TODO: Don't force graphical rotation to sync be synced with move direction!!! See TODO.md
      this.gfx?.setRotation({ degrees: this.moveDirection.toVector().angle.degrees });
   };

   // When this enemy collided.
   public OnCollision = () => {
      // TODO: If points is zero then it should not dispatch a add_points event!
      const points = assertNumber(this.attrs.getAttribute({
         gameObjectId: this.id,
         attribute: "points"
      }));

      // TODO: add_points is a bad name. Should be names pointsOnHit.
      this.enemies.eventsPoints.dispatchEvent({ type: "add_points", points, enemy: this.name });
      this.hp -= 1;
   };

   private boundToWindow = () => {
      const radius = this.diameter/2;
      const x = this.x;
      const y = this.y;
      if(x < radius) {
         this.x = radius;
      } else if(x > resolutionWidth-radius) {
         this.x = resolutionWidth-radius;
      }
      if(y < radius) {
         this.y = radius;
      } else if (y > resolutionHeight-radius) {
         this.y = resolutionHeight-radius;
      }
   };

   // unlike die despawn does NOT trigger onDeathAction
   private despawn = () => {
      // console.log(`${this.id} despawned`);
      const enemies = this.enemies; // TODO: This line could be remove right?
      enemies.enemies = enemies.enemies.filter(e => e.id !== this.id); // remove this enemy.

      const points = assertNumber(this.attrs.getAttribute({
         gameObjectId: this.id,
         attribute: "pointsOnDeath"
      }));
      if(points !== 0) {
         this.enemies.eventsPoints.dispatchEvent({type: "add_points", enemy: this.name, points });
      }

      // TODO: Maybe publish a death event or something.
      if(this.gfx) { // Clear up graphics.
         this.gfx.release();
         this.gfx = undefined;
      }
   };

   /**
    * Essentially maps actions to class methods,
    * that is has very "thin" responsibilities.
    * Actually one-lines are okey to inline here.
    */
   private HandleAction = (action: TAction) => {
      switch(action.type /* TODO: as AT */) {
         case AT.shootDirection:
            this.ShootDirection({ dirX: action.x, dirY: action.y });
            break;
         case AT.setSpeed:
            this.speed = action.pixelsPerFrame;
            break;
         case AT.setShotSpeed:
            this.shotSpeed = action.pixelsPerFrame;
            break;
         case AT.set_position:
            this.SetPosition({ x: action.x, y: action.y });
            break;
         case AT.shootTowardPlayer:
            this.ShootTowardPlayer();
            break;
         case AT.shoot_beside_player:
            this.ShootBesidePlayer(action.degrees);
            break;
         case AT.rotate_towards_player:
            this.RotateTowardsPlayer();
            break;
         case AT.setMoveDirection:
            this.setMoveDirection(action.degrees);
            break;
         case AT.move_according_to_speed_and_direction:
            this.moveAccordingToSpeedAndDirection();
            break;
         case AT.spawn: {
            // console.log(`Enemy: spawning: ${action.enemy}`);
            const { enemy, x=0, y=0, actions } = action;
            this.spawn({ enemy, pos: { x, y }, actions });
            break;
         }
         case AT.mirrorX: 
            this.mirrorX = action.value;
            break;
         case AT.mirrorY: 
            this.mirrorY = action.value;
            break;
         case AT.moveDelta:
            this.moveDelta({ x: action.x, y: action.y });
            break;
         case AT.despawn:
            this.despawn();
            break;
         case AT.incr: { // this I believe could be move into EnemyActionExecutor??
            const { gameObjectId, attribute } = action;
            this.attrs.incr({ gameObjectId: gameObjectId ?? this.id, attribute});
            break;
         }
         case AT.decr: { // this I believe could be move into EnemyActionExecutor??
            const { gameObjectId, attribute } = action;
            this.attrs.decr({ gameObjectId: gameObjectId ?? this.id, attribute});
            break;
         }
         case AT.finishLevel: // TODO: dispatch some new "finishLevel" event instead.
            this.enemies.events.dispatchEvent({ type: "gameOver" }); 
            break;
         default:
            this.gfx?.dispatch(action as TGraphicsActionWithoutHandle);
      }
   };

   private moveDelta = ({ x=0, y=0 }: Partial<TVector>) => {
      this.x = this.mirrorX ? this.x - x : this.x + x;
      this.y = this.mirrorY ? this.y - y : this.y + y;
   };

   private ShootDirection = ({ dirX, dirY }: { dirX: number, dirY: number }) => {
      const isZero = dirX === 0 && dirY === 0;
      const pixelsPerFrame = this.shotSpeed;
      // TODO: Could maybe do this with UnitVector instead.
      const pythagoras = isZero ? 9999 : Math.sqrt(dirX**2 + dirY**2);
      const speedUpFactor = pixelsPerFrame / pythagoras;

      this.spawn({
         enemy: "shot",
         pos: { x: 0, y: 0 },
         actions:  [{
            type: AT.fork,
            actions: [{
               type: AT.repeat,
               times: 99999,
               actions: [
                  /**
                   * TODO: This could instead be made with a `setMoveDir`, `setMoveSpd`,
                   * and then in yaml file a `moveAccordingToDirAndSpeed` action.
                   */
                  { type: AT.moveDelta, x: dirX * speedUpFactor, y: dirY * speedUpFactor },
                  { type: AT.waitNextFrame }
               ]
            }]
         }]
      });
   };

   /**
    * TODO: This should be removed. Instead I should do this somehow with an action or attributes,
    * so that you can shoot toward any position (or any position of a GameObject).
    */
   private ShootTowardPlayer = () => {
      const player = this.enemies.player;
      const dirX = player.x - this.x;
      const dirY = player.y - this.y;
      this.ShootDirection({ dirX, dirY });
   };

   private ShootBesidePlayer = (degrees: number) => {
      const player = this.enemies.player;
      const dirX = player.x - this.x;
      const dirY = player.y - this.y;
      const vector = new Vector(dirX, dirY).rotateClockwiseM(Angle.fromDegrees(degrees));
      this.ShootDirection({ dirX: vector.x, dirY: vector.y });
   };

   private SetPosition = ({ x, y }: {x: number, y: number}) => {
      const prevPos = this.getPosition();
      const prevPosVector = new Vector(prevPos.x, prevPos.y);
      const destVector = new Vector(x, y);
      const deltaVector = Vector.fromTo(prevPosVector, destVector);
      let deltaX = deltaVector.x;
      let deltaY = deltaVector.y;
      if(this.mirrorX) {
         deltaX = -deltaX;
      }
      if(this.mirrorY) {
         deltaY = -deltaY;
      }
      const newX = this.x + deltaX;
      const newY = this.y + deltaY;
      this.x = newX;
      this.y = newY;
   };

   private RotateTowardsPlayer = () => {
      const playerCircle = this.enemies.player;
      const playerVector = new Vector(playerCircle.x, playerCircle.y);
      // TODO: Make all positions into Vectors! Also rename Vector type to TVector.
      const enemyVector = new Vector(this.x, this.y);
      const vectorFromEnemyToPlayer = Vector.fromTo(enemyVector, playerVector);
      this.moveDirection = new UnitVector(vectorFromEnemyToPlayer);
   };

   private setMoveDirection = (degrees: number) => {
      const dir = new UnitVector(new Vector(0, -1)).rotateClockwise(Angle.fromDegrees(degrees));
      this.moveDirection = dir;
   };

   private moveAccordingToSpeedAndDirection = () => {
      const newX = this.x + this.moveDirection.x * this.speed;
      const newY = this.y += this.moveDirection.y * this.speed;
      this.x = newX;
      this.y = newY;
   };

   private spawn = (
      { enemy, pos, actions }:
      { enemy: string, pos: TVector, actions?: TAction[] }
   ) => {
      // Make a relative position into an absolute one.
      const absolute = { x: pos.x + this.x, y: pos.y + this.y };
      this.enemies.Spawn({
         enemy,
         position: absolute,
         prependActions: actions,
         parentId: this.id, // send in that THIS enemy is the parent of the child being spawned.
      });
   };

   public getPosition = (): TVector => {
      let x = this.x;
      let y = this.y;
      /**
       * If mirroring Enemy will lie about it's location.
       * It's sort of a hack actually, not super beautiful.
       */
      if(this.mirrorX) {
         x = resolutionWidth - x;
      }
      if(this.mirrorY) {
         y = resolutionHeight - y;
      }
      return { x, y };
   };
}
