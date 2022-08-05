import type { TAction } from "./actionTypes";
import type { Vector as TVector } from "../../../math/bezier";
import type { IGraphics, TGraphicsActionWithoutHandle } from "../Graphics/IGraphics";
import type { Enemies } from "./Enemies";
import type { IEnemyJson } from "./enemyConfigs/IEnemyJson";
import type { TShortFormAction } from "./actionTypesShortForms";

import { EnemyActionExecutor } from "./EnemyActionExecutor";
import { Vector } from "../../../math/Vector";
import { Angle } from "../../../math/Angle";
import { UnitVector } from "../../../math/UnitVector";
import { uuid } from "../../../utils/uuid";
import { resolutionHeight, resolutionWidth } from "../../../consts";
import { Attributes } from "./Attributes/Attributes";
import { assertNumber } from "../../../utils/typeAssertions";
import { EnemyGfx } from "./EnemyGfx";
import { BrowserDriver } from "../../../drivers/BrowserDriver";

export class Enemy {
   public X: number;
   public Y: number;
   public id: string;
   private enemies: Enemies; // enemies service
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
   public attrs = new Attributes();
   private name: string;
   // One action that is executed immediately when an enemy dies.
   private onDeathAction?: TShortFormAction;

   public constructor( enemies: Enemies, position: TVector, json: IEnemyJson ) {
      this.enemies = enemies;
      this.id = `${json.name}-${uuid()}`;
      this.name = json.name;
      this.diameter = json.diameter;
      this.X = position.x;
      this.Y = position.y;
      this.actionExecutor = new EnemyActionExecutor({
         actionHandler: this.HandleAction,
         actions: json.actions,
         getPosition: this.getPosition,
         getAttr: this.getAttr,
         input: this.enemies.input,
         gamepad: this.enemies.gamepad,
      });
      this.onDeathAction = json.onDeathAction;
      // TODO: Attrs should be be set by an Action in future, right?
      this.hp = json.hp;
      this.maxHp = json.hp;

      this.graphics = this.enemies.graphics;
      this.gfx = new EnemyGfx({
         diameter: json.diameter, graphics: this.graphics, x: this.X, y: this.Y
      });

      /**
       * Execute one frame. This important if the enemy has some initialization that it needs have
       * to have run, otherwise initialization (with actions) would be delayed one frame from
       * being constructed/added via constructor.
       */
      this.OnFrameTick();
   }

   private get hp():number {
      return assertNumber(this.attrs.GetAttribute("hp").value);
   }
   private set hp(value: number){
      this.attrs.SetAttribute({ name: "hp", value });
   }
   private get maxHp():number {
      return assertNumber(this.attrs.GetAttribute("maxHp").value);
   }
   private set maxHp(value: number){
      this.attrs.SetAttribute({ name: "maxHp", value });
   }

   public get Radius(){ return this.diameter/2; }

   public OnFrameTick = () => {
      /* const done = */ this.actionExecutor.ProgressOneFrame();
      // if(done) { console.log(`${this.name} have no more actions to execute and is fully done`); }
      // if(done) { this.die(); }

      // Safest to do all the required updates n shit here, even if hp etc have not been changed.
      if(this.attrs.GetAttribute("boundToWindow").value) {
         this.boundToWindow();
      }
      // this.updateDisplayHealth();
      this.gfx?.setPosition({ x: this.X, y: this.Y });
      this.gfx?.setRotation({ degrees: this.moveDirection.toVector().angle.degrees });
   };

   /**
    * When this enemy collided.
    */
   public OnCollision = () => {
      const points = assertNumber(this.attrs.GetAttribute("points").value);

      this.enemies.eventsPoints.dispatchEvent({ type: "add_points", points, enemy: this.name });
      this.hp -= 1;

      // this.updateDisplayHealth();

      if(this.hp < 1) { this.die(); }
   };

   private boundToWindow = () => {
      const radius = this.diameter/2;
      if(this.X < radius) {
         this.X = radius;
      } else if(this.X > resolutionWidth-radius) {
         this.X = resolutionWidth-radius;
      }
      if(this.Y < radius) {
         this.Y = radius;
      } else if (this.Y > resolutionHeight-radius) {
         this.Y = resolutionHeight-radius;
      }
   };

   // unlike die despawn does NOT trigger onDeathAction
   private despawn = () => {
      const enemies = this.enemies;
      // remove this enemy.
      enemies.enemies = enemies.enemies.filter(e => e.id !== this.id);

      const points = assertNumber(this.attrs.GetAttribute("pointsOnDeath").value);
      if(points !== 0) {
         this.enemies.eventsPoints.dispatchEvent({type: "add_points", enemy: this.name, points });
      }

      // TODO: Maybe publish a death event or something.
      if(this.gfx) { // Clear up graphics.
         this.gfx.release();
         this.gfx = undefined;
      }
   };

   // unlike despawn die triggers onDeathAction
   private die = () => {
      if(this.onDeathAction) {
         const done = this.actionExecutor.ExecuteOneAction(this.onDeathAction);
         if(!done) {
            BrowserDriver.Alert(
               `Enemy '${this.id}'s onDeathAction required more than 1 frame to execute.
               An onDeathAction must be able to finish execution after 1 frame.`
            );
         }
      }
      this.despawn();
   };

   /**
    * Essentially maps actions to class methods,
    * that is has very "thin" responsibilities.
    * Actually one-lines are okey to inline here.
    */
   private HandleAction = (action: TAction) => {
      switch(action.type) {
         case "shootDirection":
            this.ShootDirection({ dirX: action.x, dirY: action.y });
            break;
         case "setSpeed":
            this.speed = action.pixelsPerFrame;
            break;
         case "setShotSpeed":
            this.shotSpeed = action.pixelsPerFrame;
            break;
         case "set_position":
            this.SetPosition({ x: action.x, y: action.y });
            break;
         case "shoot_toward_player":
            this.ShootTowardPlayer();
            break;
         case "shoot_beside_player":
            this.ShootBesidePlayer(action.degrees);
            break;
         case "rotate_towards_player":
            this.RotateTowardsPlayer();
            break;
         case "setMoveDirection":
            this.setMoveDirection(action.degrees);
            break;
         case "move_according_to_speed_and_direction":
            this.moveAccordingToSpeedAndDirection();
            break;
         case "spawn": {
            const { enemy, x=0, y=0, actions } = action;
            this.spawn({ enemy, pos: { x, y }, actions });
            break;
         }
         case "mirrorX": 
            this.mirrorX = action.value;
            break;
         case "mirrorY": 
            this.mirrorY = action.value;
            break;
         case "moveDelta":
            this.moveDelta({ x: action.x, y: action.y });
            break;
         case "setAttribute":
            this.attrs.SetAttribute({ name: action.attribute, value: action.value });
            break;
         case "despawn":
            this.despawn();
            break;
         case "die":
            this.die();
            break;
         case "incr":
            this.attrs.incr(action.attribute);
            break;
         case "decr":
            this.attrs.decr(action.attribute);
            break;
         default:
            this.gfx?.dispatch(action as TGraphicsActionWithoutHandle);
      }
   };

   private moveDelta = ({ x=0, y=0 }: Partial<TVector>) => {
      this.X = this.mirrorX ? this.X - x : this.X + x;
      this.Y = this.mirrorY ? this.Y - y : this.Y + y;
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
         actions:  [
            {
               fork: [
                  {
                     forever: [
                        /**
                         * TODO: This could instead be made with a `setMoveDir`, `setMoveSpd`,
                         * and then in yaml file a `moveAccordingToDirAndSpeed` action.
                         */
                        { type: "moveDelta", x: dirX * speedUpFactor, y: dirY * speedUpFactor },
                        { type: "waitNextFrame" }
                     ]},
               ]
            }
         ]
      });
   };

   private ShootTowardPlayer = () => {
      const player = this.enemies.player;
      const dirX = player.X - this.X;
      const dirY = player.Y - this.Y;
      this.ShootDirection({ dirX, dirY });
   };

   private ShootBesidePlayer = (degrees: number) => {
      const player = this.enemies.player;
      const dirX = player.X - this.X;
      const dirY = player.Y - this.Y;
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
      const newX = this.X + deltaX;
      const newY = this.Y + deltaY;
      this.X = newX;
      this.Y = newY;
   };

   private RotateTowardsPlayer = () => {
      const playerCircle = this.enemies.player;
      const playerVector = new Vector(playerCircle.X, playerCircle.Y);
      // TODO: Make all positions into Vectors! Also rename Vector type to TVector.
      const enemyVector = new Vector(this.X, this.Y);
      const vectorFromEnemyToPlayer = Vector.fromTo(enemyVector, playerVector);
      this.moveDirection = new UnitVector(vectorFromEnemyToPlayer);
   };

   private setMoveDirection = (degrees: number) => {
      const dir = new UnitVector(new Vector(0, -1)).rotateClockwise(Angle.fromDegrees(degrees));
      this.moveDirection = dir;
   };

   private moveAccordingToSpeedAndDirection = () => {
      const newX = this.X + this.moveDirection.x * this.speed;
      const newY = this.Y += this.moveDirection.y * this.speed;
      this.X = newX;
      this.Y = newY;
   };

   private spawn = (
      { enemy, pos, actions }:
      { enemy: string, pos: TVector, actions?: TShortFormAction[] }
   ) => {
      // Make a relative position into an absolute one.
      const absolute = { x: pos.x + this.X, y: pos.y + this.Y };
      this.enemies.Spawn({ enemy, position: absolute, prependActions: actions });
   };

   private getPosition = (): TVector => {
      let x = this.X;
      let y = this.Y;
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

   private getAttr = (attr: string) => {
      return this.attrs.attrExists(attr) && this.attrs.GetAttribute(attr).value;
   };

   // * TODO: Display health in some other way. Previously I cloned the enemy gfx bt black and
   // * scaled that one inversely proporionally to hp/maxHp, but I think it might require too
   // * much to have two div per Enemy so I scrapped it.
   // private updateDisplayHealth = () => {
   //    // const factorHealthLeft = this.hp / this.maxHp;
   // };
}
