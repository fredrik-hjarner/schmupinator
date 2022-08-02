import type { IService } from "../IService";
import type { IDestroyable } from "../../../utils/types/IDestroyable";

export interface IGameSpeed extends IService, IDestroyable {
   name: string;

   // nr of frames per 1/60 seconds.
   get GameSpeed(): number

   // nr of frames per 1/60 seconds.
   set GameSpeed(value: number)
}
