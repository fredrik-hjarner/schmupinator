import type { IService } from "../IService";

export type ButtonsPressed = {
   shoot: boolean
   laser: boolean
   left: boolean
   right: boolean
   up: boolean
   down: boolean
}

export interface IInput extends IService {
   ButtonsPressed: ButtonsPressed
}