import type {
   TAction, TRotateAroundAbsolutePoint, TRotateAroundRelativePoint
} from "./actionTypes";
import type { Vector as TVector } from "../../../math/bezier";
import type { TAttributeValue } from "./Attributes/Attributes";
import type { IInput } from "../Input/IInput";
import type { GamePad } from "../GamePad/GamePad";

import { Vector } from "../../../math/Vector";
import { Angle } from "../../../math/Angle";
import { GeneratorUtils } from "../../../utils/GeneratorUtils";
import { ShortFormToLongForm, TShortFormAction } from "./actionTypesShortForms";
import { playerSpeedPerFrame, resolutionHeight, resolutionWidth } from "../../../consts";

type TActionHandler = (action: TAction) => void;

type TEnemyActionExecutorArgs = {
   /**
   * The actions to execute.
   * Executes them in sequence.
   * You can execute things in parallel with special compound actions like parallelRace.
   */
   actions: TShortFormAction[];
   actionHandler: TActionHandler;
   getPosition: () => TVector;
   getAttr: (attr: string) => TAttributeValue;
   input: IInput;
   gamepad: GamePad;
}

export class EnemyActionExecutor {
   // deps/services
   private input: IInput;
   private gamepad: GamePad;

   private actionHandler: (action: TAction) => void;
   private getPosition: () => TVector;
   private getAttr: (attr: string) => TAttributeValue;
   /**
    * The only reason I don't have only ONE generator is because of the `fork` action.
    * `fork` creates/adds a new generator. I think that's the only way it could work really.
    */
   public generators: Generator<void, void, void>[];

   public constructor(params: TEnemyActionExecutorArgs) {
      const { actions, actionHandler, getPosition, getAttr, input, gamepad } = params;
      this.actionHandler = actionHandler;
      this.getPosition = getPosition;
      this.getAttr = getAttr;
      this.input = input;
      this.gamepad = gamepad;
      this.generators = [this.makeGenerator(actions)];
   }

   // TODO: Maybe I should clear up generators that have status `done`.
   // Return true when all generators have finished, i.e. no actions left ot execute.
   public ProgressOneFrame(): boolean {
      // TODO: Die/kill self/explode when done!
      const prevGeneratorsLength =  this.generators.length;
      const nexts = this.generators.map(g => {
         return g.next();
      });
      const generatorsLength = this.generators.length;
      if(prevGeneratorsLength === generatorsLength) {
         /**
          * During the execution more generators can be added,
          * so only if the number has not been changed can we make assumptions about all generators
          * having finished or not.
          */
         const allDone = nexts.every(next => next.done);
         return allDone;
      }
      return false;
   }

   /**
   * Private
   */

   private *makeGenerator(shortFormActions: TShortFormAction[] = []): Generator<void, void, void> {
      const actions = shortFormActions.map(ShortFormToLongForm);
      let currIndex = 0;
      const nrActions = actions.length;

      while(currIndex < nrActions) { // if index 1 & nr 2 => kosher
         const currAction = actions[currIndex];
         // console.log(currAction.type);
         switch(currAction.type) {
            case "moveAccordingToInput": {
               const input = this.input;
               const gamepad = this.gamepad;

               let speed = playerSpeedPerFrame[0];

               const left = input.ButtonsPressed.left || gamepad.left;
               const right = input.ButtonsPressed.right || gamepad.right;
               const up = input.ButtonsPressed.up || gamepad.up;
               const down = input.ButtonsPressed.down || gamepad.down;

               const horizonal = left || right;
               const vertical = up || down;
               if(horizonal && vertical) {
                  // decrease speed to not have diagonal movement be faster.
                  speed /= Math.SQRT2;
               }

               let x=0;
               let y=0;
               if (left) { x -= speed; }
               if (right) { x += speed; }
               if (up) { y -= speed; }
               if (down) { y += speed; }
               if(x !== 0 || y !== 0) {
                  this.actionHandler({ type: "moveDelta", x, y });
               }
               break;
            }

            case "waitInputShoot": {
               const shootPressed = () => this.input.ButtonsPressed.space || this.gamepad.shoot;
               while(!shootPressed()) { yield; }
               break;
            }

            case "waitUntilAttrIs": {
               const { attr, is } = currAction;
               while(this.getAttr(attr) !== is) { yield; }
               break;
            }

            case "fork": {
               // Create a new generator for the fork to allow it to execute parallely.
               const generator = this.makeGenerator(currAction.actions);
               this.generators.push(generator);
               // execute once, otherwise the first forked action would execute next frame.
               generator.next();
               break;
            }

            case "do": { // flatten essentially.
               yield* this.makeGenerator(currAction.acns);
               break;
            }

            case "parallelRace": {
               const generators = currAction.actionsLists.map(acns => this.makeGenerator(acns));
               yield* GeneratorUtils.parallelRace(generators);
               break;
            }

            case "parallelAll": {
               const generators = currAction.actionsLists.map(acns => this.makeGenerator(acns));
               yield* GeneratorUtils.parallelAll(generators);
               break;
            }

            case "repeat": {
               yield*  GeneratorUtils.Repeat({
                  makeGenerator: () => this.makeGenerator(currAction.actions),
                  times: currAction.times
               });
               break;
            }

            case "attr": {
               const { attrName, is, yes, no } = currAction;
               const attrValue = this.getAttr(attrName);
               yield* this.makeGenerator(attrValue === is ? yes : no);
               break;
            }

            case "waitNextFrame": {
               yield;
               break;
            }

            case "wait": {
               for(let i=0; i<currAction.frames; i++) {
                  yield;
               }
               break;
            }

            case "waitTilInsideScreen": {
               const left = -20;
               const right = resolutionWidth + 20;
               const top = -20;
               const bottom = resolutionHeight + 20;
               // TODO: Move function.
               const isOutsideScreen = ({ x, y }: TVector): boolean => {
                  return x < left || x > right || y < top || y > bottom;
               };
               while(isOutsideScreen(this.getPosition())) {
                  yield;
               }
               break;
            }

            case "waitTilOutsideScreen": {
               const left = -30;
               const right = resolutionWidth + 30;
               const top = -30;
               const bottom = resolutionHeight + 30;
               // TODO: Move function.
               const isOutsideScreen = ({ x, y }: TVector): boolean => {
                  return x < left || x > right || y < top || y > bottom;
               };
               while(!isOutsideScreen(this.getPosition())) {
                  yield;
               }
               break;
            }

            case "move": {
               const moveX = currAction.x ?? 0;
               const moveY = currAction.y ?? 0;
               const stepX = moveX / currAction.frames;
               const stepY = moveY / currAction.frames;
               /**
                * Start from 1 so that first step is not zero progression, but first step of 
                * progression.
                * Allow passedFrames to go up to (include) currActon.frames, i.e. if 4 then
                * allow passedFrames to go all the way up to 4.
                */
               for(let passedFrames=1; passedFrames<=currAction.frames; passedFrames++) {
                  this.actionHandler({ type: "moveDelta", x: stepX, y: stepY });
                  yield;
               }
               break;
            }

            case "moveToAbsolute": {
               const startPos = this.getPosition();
               const { moveTo } = currAction;
               const moveX = moveTo.x !== undefined ? moveTo.x - startPos.x : 0;
               const moveY = moveTo.y !== undefined ? moveTo.y - startPos.y : 0;
               const stepX = moveX / currAction.frames;
               const stepY = moveY / currAction.frames;
               for(let passedFrames=1; passedFrames<=currAction.frames; passedFrames++) {
                  this.actionHandler({ type: "moveDelta", x: stepX, y: stepY });
                  yield;
               }
               break;
            }

            case "rotate_around_relative_point": {
               const pointX = currAction.point.x ?? 0;
               const pointY = currAction.point.y ?? 0;
               const pointToPosVector = new Vector(-pointX, -pointY);
               yield* rotateAroundPoint(currAction, pointToPosVector, this.actionHandler);
               break;
            }

            case "rotate_around_absolute_point": {
               const startPos = this.getPosition();
               const pointX = currAction.point.x ?? startPos.x;
               const pointY = currAction.point.y ?? startPos.y;
               const pointToPosVector = Vector.fromTo(
                  new Vector(pointX, pointY),
                  new Vector(startPos.x, startPos.y),
               );
               yield* rotateAroundPoint(currAction, pointToPosVector, this.actionHandler);
               break;
            }

            default:
               this.actionHandler(currAction);
         }
         currIndex++;
      }
   }
}

const rotateAroundPoint = function*(
   currAction: TRotateAroundAbsolutePoint | TRotateAroundRelativePoint,
   pointToPosVector: Vector,
   actionHandler: TActionHandler
): Generator<void, void, void> {
   const stepDegrees = currAction.degrees / currAction.frames;
   for(let passedFrames=1; passedFrames<=currAction.frames; passedFrames++) {
      const prevDegrees = stepDegrees * (passedFrames-1);
      const currDegrees = stepDegrees * passedFrames;

      const prevRotated = pointToPosVector.rotateClockwise(Angle.fromDegrees(prevDegrees));
      const currRotated = pointToPosVector.rotateClockwise(Angle.fromDegrees(currDegrees));

      const delta = Vector.fromTo(prevRotated, currRotated);
      actionHandler({ type: "moveDelta", x: delta.x, y: delta.y });
      yield;
   }
};
