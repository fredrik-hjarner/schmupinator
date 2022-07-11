import type { IService } from "../IService";

export interface IGameSpeed extends IService {
   name: string;

   // nr of frames per 1/60 seconds.
   get GameSpeed(): number

   // nr of frames per 1/60 seconds.
   set GameSpeed(value: number)
}
