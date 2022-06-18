import type { App } from "../../App";
import type { TAction } from "./actionTypes";
import type { Vector as TVector } from "../../../math/bezier";
import type { TCollisions } from "../Collisions/Collisions";
import type { THandle, TResponse_AskForElement, IGraphics } from "../Graphics/IGraphics";
import type { TAttributeValue } from "./Attributes/Attributes";

import { EnemyActionExecutor } from "./EnemyActionExecutor";
import { Vector } from "../../../math/Vector";
import { Angle } from "../../../math/Angle";
import { IEnemyJson } from "./enemyConfigs/IEnemyJson";
import { UnitVector } from "../../../math/UnitVector";
import { uuid } from "../../../utils/uuid";
import { resolutionHeight, resolutionWidth } from "../../../consts";
import { TShortFormAction } from "./actionTypesShortForms";
import { Attributes } from "./Attributes/Attributes";
import { assertNumber } from "../../../utils/typeAssertions";

export class Enemy {
   app: App;
   X: number;
   Y: number;
   id: string;
   private graphics: IGraphics; // Graphics service
   private diameter: number;
   private speed = 0;
   private shotSpeed = 0.2; // super slow default shot speed, you'll always want to override this.
   // facing/aim
   // default direction down.
   private direction = new UnitVector(new Vector(0, 1));
   private flags: string[];
   private mirrorX = false;
   private mirrorY = false;
   private actionExecutor: EnemyActionExecutor;
   private graphicsHandle?: THandle; // handle to GraphicsElement from Graphics service.
   private attrs = new Attributes();

   /**
    * Public
    */
   // TODO: take object as input instead.
   constructor(
      app: App,
      position: TVector,
      json: IEnemyJson,
      flags: string[] = []
   ) {
      this.app = app;
      this.id = `${json.name}-${uuid()}`;
      this.diameter = json.diameter;
      this.X = position.x;
      this.Y = position.y;
      this.flags = flags;
      this.actionExecutor = new EnemyActionExecutor({
         actionHandler: this.HandleAction,
         actions: json.actions,
         getPosition: this.getPosition,
         getFlag: this.getFlag
      });
      // TODO: Attrs should be be set by an Action in future, right?
      this.attrs.SetAttribute({ name: "hp", value: json.hp });
      this.attrs.SetAttribute({ name: "maxHp", value: json.hp });

      // New graphics engine code
      this.graphics = this.app.graphics;
      const response =
         this.graphics.Dispatch({ type:"actionAskForElement" }) as TResponse_AskForElement;
      this.graphicsHandle = response.handle;
      this.graphics.Dispatch({
         type:"actionSetPosition",
         payload: { handle: this.graphicsHandle, x: this.X, y: this.Y }
      });
      this.graphics.Dispatch({
         type:"actionSetDiameter",
         payload: { handle: this.graphicsHandle, diameter: json.diameter }
      });
      this.graphics.Dispatch({
         type:"actionSetColor",
         payload: { handle: this.graphicsHandle, color: "red" }
      });

      this.updateDisplayHealth();
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

   public get Radius(){
      return this.diameter/2;
   }

   public OnFrameTick = () => {
      this.actionExecutor.ProgressOneFrame();
   };

   public OnCollisions = (collisions: TCollisions) => {
      /**
       * Check if got hit
       */
      const { enemiesThatWereHit } = collisions;
      if(enemiesThatWereHit.includes(this.id)) {
         const points = assertNumber(this.attrs.GetAttribute("points").value);

         this.app.events.dispatchEvent({
            type: "add_points",
            points
         });
         this.hp -= 1;

         /**
          * Display damage. Starts filled with color,
          * border gets successively thinner until they are gone.
          */
         this.updateDisplayHealth();

         if(this.hp < 1) {
            this.die();
         }
      }
   };

   private die = () => {
      const enemies = this.app.enemies;
      // remove this enemy.
      enemies.enemies = enemies.enemies.filter(e => e.id !== this.id);
      // TODO: Maybe publish a death event or something.
      // Clear up graphics.
      if(this.graphicsHandle) {
         this.graphics.Dispatch({
            type: "actionRelease",
            payload: { handle: this.graphicsHandle }
         });
         this.graphicsHandle = undefined;
      }
      return;
   };

   /**
    * Essentially maps actions to class methods,
    * that is has very "thin" responsibilities.
    */
   private HandleAction = (action: TAction) => {
      switch(action.type) {
         case "shootDirection":
            this.ShootDirection({ dirX: action.x, dirY: action.y });
            break;

         case "setSpeed":
            this.SetSpeed(action.pixelsPerFrame);
            break;

         case "setShotSpeed":
            this.SetShotSpeed(action.pixelsPerFrame);
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

         case "move_according_to_speed_and_direction":
            this.moveAccordingToSpeedAndDirection();
            break;

         case "spawn": {
            const { enemy, flags, x, y, actions } = action;
            this.spawn({ enemy, flags, pos: { x, y }, actions });
            break;
         }

         case "mirrorX": {
            const { value } = action;
            this.setMirrorX(value);
            break;
         }

         case "mirrorY": {
            const { value } = action;
            this.setMirrorY(value);
            break;
         }

         case "moveDelta": {
            const { x, y } = action;
            this.moveDelta({ x, y });
            break;
         }

         case "setAttribute": {
            const { attribute, value } = action;
            this.setAttribute({ attribute, value });
            break;
         }

         case "die":
            this.die();
            break;
      
         default:
            console.error(`unknown action type: ${action.type}`);
      }

      if(this.graphicsHandle) {
         this.graphics.Dispatch({
            type:"actionSetPosition",
            payload: { handle: this.graphicsHandle, x: this.X, y: this.Y }
         });
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
         enemy:"shot",
         pos: { x: 0, y: 0 },
         actions:  [
            { type: "setAttribute", attribute: "points", value: 0 },
            { repeat: 999, actions: [
               { type: "moveDelta", x: dirX * speedUpFactor, y: dirY * speedUpFactor },
               { type: "waitNextFrame" }
            ]},
         ]
      });
   };

   private ShootTowardPlayer = () => {
      const player = this.app.player;
      const dirX = player.X - this.X;
      const dirY = player.Y - this.Y;
      this.ShootDirection({ dirX, dirY });
   };

   private ShootBesidePlayer = (degrees: number) => {
      const player = this.app.player;
      const dirX = player.X - this.X;
      const dirY = player.Y - this.Y;
      const vector = new Vector(dirX, dirY).rotateClockwise(Angle.fromDegrees(degrees));
      this.ShootDirection({ dirX: vector.x, dirY: vector.y });
   };

   private SetSpeed = (pixelsPerFrame: number) => {
      this.speed = pixelsPerFrame;
   };

   private SetShotSpeed = (pixelsPerFrame: number) => {
      this.shotSpeed = pixelsPerFrame;
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
      const playerCircle = this.app.player;
      const playerVector = new Vector(playerCircle.X, playerCircle.Y);
      // TODO: Make all positions into Vectors! Also rename Vector type to TVector.
      const enemyVector = new Vector(this.X, this.Y);
      const vectorFromEnemyToPlayer = Vector.fromTo(enemyVector, playerVector);
      this.direction = new UnitVector(vectorFromEnemyToPlayer);
   };

   private moveAccordingToSpeedAndDirection = () => {
      const newX = this.X + this.direction.x * this.speed;
      const newY = this.Y += this.direction.y * this.speed;
      this.X = newX;
      this.Y = newY;
   };

   private spawn = (
      { enemy, flags, pos, actions }:
      { enemy: string, flags?: string[], pos: TVector, actions?: TShortFormAction[] }
   ) => {
      // Make a relative position into an absolute one.
      const absolute = { x: pos.x + this.X, y: pos.y + this.Y };
      this.app.enemies.Spawn({ enemy, flags, position: absolute, prependActions: actions });
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

   private getFlag = (flag: string) => this.flags.includes(flag);

   private setMirrorX = (value: boolean) => {
      this.mirrorX = value;
   };

   private setMirrorY = (value: boolean) => {
      this.mirrorY = value;
   };

   private setAttribute = (params: { attribute: string, value: TAttributeValue }) => {
      const { attribute, value } = params;
      this.attrs.SetAttribute({ name: attribute, value });
   };

   private updateDisplayHealth = () => {
      const factorHealthLeft = this.hp / this.maxHp;

      if(this.graphicsHandle) {
         this.graphics.Dispatch({
            type:"actionSetHealth",
            payload: { handle: this.graphicsHandle, healthFactor: factorHealthLeft }
         });
      }
   };
}
