import type { App } from "../../App";
import type { PotentialShot } from "../Shots/PotentialShot";
import type { TAction } from "./actionTypes";
import type { Vector as TVector } from "../../../math/bezier";
import type { TCollisions } from "../Collisions/Collisions";

import { EnemyActionExecutor } from "./EnemyActionExecutor";
import { Vector } from "../../../math/Vector";
import { Angle } from "../../../math/Angle";
import { IEnemyJson } from "./enemyConfigs/IEnemyJson";
import { UnitVector } from "../../../math/UnitVector";
import { uuid } from "../../../utils/uuid";
import { resolutionHeight, resolutionWidth } from "../../../consts";
import {
   Graphics, THandle, TResponse_AskForElement
} from "../Graphics/Graphics";

export class Enemy {
   app: App;
   X: number;
   Y: number;
   id: string;
   private graphics: Graphics; // Graphics service
   private maxHp: number;
   private hp: number;
   private diameter: number;
   private speed: number;
   private shotSpeed: number;
   private direction: UnitVector;
   private flags: string[];
   private mirrorX: boolean;
   private mirrorY: boolean;
   private actionExecutor: EnemyActionExecutor;
   private graphicsHandle?: THandle; // handle to GraphicsElement from Graphics service.

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
      this.maxHp = json.hp;
      this.hp = json.hp;
      this.diameter = json.diameter;
      this.X = position.x;
      this.Y = position.y;
      this.shotSpeed = 0.2; // super slow default shot speed, you'll always want to override this.
      this.flags = flags;
      this.mirrorX = false;
      this.mirrorY = false;
      this.actionExecutor = new EnemyActionExecutor({
         actionHandler: this.HandleAction,
         actions: json.actions,
         getPosition: this.getPosition,
         getFlag: this.getFlag
      });
      this.speed = 0;
      // default direction down.
      this.direction = new UnitVector(new Vector(0, 1));

      /**
       * New graphics engine code
       */
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

      this.updateDisplayHealth();
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
         this.hp -= 1;

         /**
          * Display damage.
          * Starts filled with color,
          * border gets successively thinner until they are gone.
          */
         this.updateDisplayHealth();

         // Die
         if(this.hp < 1) {
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
         }
      }
   };

   /**
    * Essentially maps actions to class methods,
    * that is has very "thin" responsibilities.
    */
   HandleAction = (action: TAction) => {
      switch(action.type) {
         case "shootDirection": {
            this.ShootDirection({ dirX: action.x, dirY: action.y });
            break;
         }

         case "setSpeed": {
            this.SetSpeed(action.pixelsPerFrame);
            break;
         }

         case "setShotSpeed": {
            this.SetShotSpeed(action.pixelsPerFrame);
            break;
         }

         case "set_position": {
            this.SetPosition({ x: action.x, y: action.y });
            break;
         }

         case "shoot_toward_player": {
            this.ShootTowardPlayer();
            break;
         }

         case "shoot_beside_player": {
            this.ShootBesidePlayer(action.degrees);
            break;
         }

         case "rotate_towards_player": {
            this.RotateTowardsPlayer();
            break;
         }

         case "move_according_to_speed_and_direction": {
            this.moveAccordingToSpeedAndDirection();
            break;
         }

         case "spawn": {
            const { enemy, flags, x, y } = action;
            this.spawn({ enemy, flags, position: { x, y } });
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
            x: this.X,
            y: this.Y,
            spdX: dirX * speedUpFactor,
            spdY: dirY * speedUpFactor
         },
      ];
      this.app.enemyShots.TryShoot(potentialShots);
   };

   ShootTowardPlayer = () => {
      const player = this.app.player;
      const dirX = player.X - this.X;
      const dirY = player.Y - this.Y;
      this.ShootDirection({ dirX, dirY });
   };

   ShootBesidePlayer = (degrees: number) => {
      const player = this.app.player;
      const dirX = player.X - this.X;
      const dirY = player.Y - this.Y;
      const vector = new Vector(dirX, dirY).rotateClockwise(Angle.fromDegrees(degrees));
      this.ShootDirection({ dirX: vector.x, dirY: vector.y });
   };

   SetSpeed = (pixelsPerFrame: number) => {
      this.speed = pixelsPerFrame;
   };

   SetShotSpeed = (pixelsPerFrame: number) => {
      this.shotSpeed = pixelsPerFrame;
   };

   SetPosition = ({ x, y }: {x: number, y: number}) => {
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

      if(this.graphicsHandle) {
         this.graphics.Dispatch({
            type:"actionSetPosition",
            payload: { handle: this.graphicsHandle, x: newX, y: newY }
         });
      }
   };

   RotateTowardsPlayer = () => {
      const playerCircle = this.app.player;
      const playerVector = new Vector(playerCircle.X, playerCircle.Y);
      // TODO: Make all positions into Vectors! Also rename Vector type to TVector.
      const enemyVector = new Vector(this.X, this.Y);
      const vectorFromEnemyToPlayer = Vector.fromTo(enemyVector, playerVector);
      this.direction = new UnitVector(vectorFromEnemyToPlayer);
   };

   /**
    * Private
    */
   moveAccordingToSpeedAndDirection = () => {
      const newX = this.X + this.direction.x * this.speed;
      const newY = this.Y += this.direction.y * this.speed;
      this.X = newX;
      this.Y = newY;

      if(this.graphicsHandle) {
         this.graphics.Dispatch({
            type:"actionSetPosition",
            payload: { handle: this.graphicsHandle, x: newX, y: newY }
         });
      }
   };

   spawn = ({ enemy, flags, position }: { enemy: string, flags?: string[], position: TVector }) => {
      this.app.enemies.Spawn({ enemy, flags, position });
   };

   getPosition = (): TVector => {
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

   getFlag = (flag: string) => this.flags.includes(flag);

   setMirrorX = (value: boolean) => {
      this.mirrorX = value;
   };

   setMirrorY = (value: boolean) => {
      this.mirrorY = value;
   };

   updateDisplayHealth = () => {
      const factorHealthLeft = this.hp / this.maxHp;

      if(this.graphicsHandle) {
         this.graphics.Dispatch({
            type:"actionSetHealth",
            payload: { handle: this.graphicsHandle, healthFactor: factorHealthLeft }
         });
      }
   };
}
