import type { IService } from "../IService";
import type { IDestroyable } from "../../../utils/types/IDestroyable";

export interface IPseudoRandom extends IService, IDestroyable {
   /** Returns an integer between min (inclusive) and max (inclusive) */
   randomInt: (min: number, max: number) => number;
}
