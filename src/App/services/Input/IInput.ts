import type { IService } from "../IService";

export type TKey =  "shoot" | "laser" | "left" | "right" | "up" | "down";

export type ButtonsPressed = {
   shoot: boolean
   laser: boolean
   left: boolean
   right: boolean
   up: boolean
   down: boolean
}

export interface IInput extends IService {
   ButtonsPressed: ButtonsPressed;
   /**
    * Allows someone from the outside to assign a onKeyUpCallback that is called onKeyUp.
    * Up to client/user to unassign the callback.
    */
   onKeyUpCallback?: (key: TKey) => void;
}