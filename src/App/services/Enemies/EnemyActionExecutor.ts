import type { TAction } from "./actionTypes";
import type { Vector as TVector } from "../../../math/bezier";

import { Vector } from "../../../math/Vector";
import { Angle } from "../../../math/Angle";
import { GeneratorUtils } from "../../../utils/GeneratorUtils";
import { ShortFormToLongForm, TShortFormAction } from "./actionTypesShortForms";

type TEnemyActionExecutorArgs = {
   /**
   * The actions to execute.
   * Executes them in sequence.
   * You can execute things in parallell with special compound actions like parallellRace.
   */
   actions: TShortFormAction[];
   actionHandler: (action: TAction) => void;
   getPosition: () => TVector;
   getFlag: (flag: string) => boolean;
}

export class EnemyActionExecutor {
   private actionHandler: (action: TAction) => void;
   private getPosition: () => TVector;
   private getFlag: (flag: string) => boolean;
   generator: Generator<void, void, void>;

   constructor({ actions, actionHandler, getPosition, getFlag }: TEnemyActionExecutorArgs) {
      this.actionHandler = actionHandler;
      this.getPosition = getPosition;
      this.getFlag = getFlag;
      this.generator = this.makeGenerator(actions);
   }

   // TODO: Prolly return something special when died/finished.
   public ProgressOneFrame() {
      // TODO: Die/kill self/explode when done!
      this.generator.next();
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
         switch(currAction.type) {
            case "do": { // flatten essentially.
               yield* this.makeGenerator(currAction.acns);
               break;
            }

            case "parallellRace": {
               const generators = currAction.actionsLists.map(acns => this.makeGenerator(acns));
               yield* GeneratorUtils.ParallellRace(generators);
               break;
            }

            case "parallellAll": {
               const generators = currAction.actionsLists.map(acns => this.makeGenerator(acns));
               yield* GeneratorUtils.ParallellAll(generators);
               break;
            }

            case "repeat": {
               yield*  GeneratorUtils.Repeat({
                  makeGenerator: () => this.makeGenerator(currAction.actions),
                  times: currAction.times
               });
               break;
            }

            case "flag": {
               const { flagName: flag, yes, no } = currAction;
               const flagValue = this.getFlag(flag);
               yield* this.makeGenerator(flagValue ? yes : no);
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

            case "rotate_around_relative_point":
            case "rotate_around_absolute_point": {
               const startPos = this.getPosition();
               const startPosVector = new Vector(startPos.x, startPos.y);
               /**
                * Start from 1 so that first step is not zero progression, but first step of 
                * progression.
                * Allow passedFrames to go up to (include) currActon.frames, i.e. if 4 then
                * allow passedFrames to go all the way up to 4.
                */
               for(let passedFrames=1; passedFrames<=currAction.frames; passedFrames++) {
                  const progress = passedFrames / currAction.frames;
                  switch(currAction.type) {
                     case "rotate_around_absolute_point": {
                        const pointX = currAction.point.x ?? startPos.x;
                        const pointY = currAction.point.y ?? startPos.y;
                        const pointVector = new Vector(pointX, pointY);
                        const rotatedVector = startPosVector.rotateClockwiseAroundVector(
                           Angle.fromDegrees(progress*currAction.degrees),
                           pointVector
                        );
                        this.actionHandler({
                           type: "set_position",
                           x: rotatedVector.x,
                           y: rotatedVector.y
                        });
                        break;
                     }
                     /**
                      * TODO: Reduce code duplication between
                      * rotate_around_absolute_point and rotate_around_relative_point.
                      */
                     case "rotate_around_relative_point": {
                        const pointX = currAction.point.x ?? 0;
                        const pointY = currAction.point.y ?? 0;
                        const pointVector = new Vector(startPos.x + pointX, startPos.y + pointY);
                        const rotatedVector = startPosVector.rotateClockwiseAroundVector(
                           Angle.fromDegrees(progress*currAction.degrees),
                           pointVector
                        );
                        this.actionHandler({
                           type: "set_position",
                           x: rotatedVector.x,
                           y: rotatedVector.y
                        });
                        break;
                     }
                  }
                  yield;
               }
               break;
            }

            default:
               this.actionHandler(currAction);
         }
         currIndex++;
      }
   }
}
