import type { TAction } from "./actionTypes";
import type { TShortFormAction } from "./actionTypesShortForms";

import { isShortFormAction, ShortFormToLongForm } from "./actionTypesShortForms";

type TIsShortForm = (action: object) => boolean;
type TTransformOneAction = (action: object) => object;

/**
 * Transforms all actions recursively.
 * Mutates the input.
 * This one is only used for tests, so has a few more "dependency injection" params.
 */
export function transform(
   isShortForm: TIsShortForm,
   transformOneAction: TTransformOneAction,
   actions: unknown[]
){
   actions.forEach(action => {
      if(Array.isArray(action)){
         // check each recursively
         transform(isShortForm, transformOneAction, action);
      } else if(typeof action === "object" && action !== null) {
         // an object means it is an action
         // check if it should be transformed
         if(isShortForm(action)) {
            const transformed = transformOneAction(action);
            // delete all keys on the original
            // then place all new keys on original
            Object.keys(action).forEach(key => {
               //@ts-ignore: a key on an object is a key on an object.
               delete action[key];
            });
            // this accomplished replacing the object fully
            Object.keys(transformed).forEach(key => {
               //@ts-ignore: a key on an object is a key on an object.
               action[key] = transformed[key]; // eslint-disable-line
            });
         }
         // then go over all it's values recursively
         const values = Object.values(action);
         //@ts-ignore
         transform(isShortForm, transformOneAction, values);
      } else {
         // neither array of an object. base case
      }
   });
   return actions;
}

/**
 * Transforms all actions recursively.
 * Mutates the input.
 */
export function transformActions(actions: (TAction|TShortFormAction)[]): TAction[] {
   //@ts-ignore: Don't understand how to solve this.
   return transform(isShortFormAction, ShortFormToLongForm, actions);
}