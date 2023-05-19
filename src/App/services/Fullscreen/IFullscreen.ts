import type { IDestroyable } from "../../../utils/types/IDestroyable";
import type { IService } from "../IService";

export interface IFullscreen extends IService, IDestroyable {
   /**
    * Expose the scale that the Fullscreen sets.
    * 1 is not scaled. 2 is double size. 0.5 is half size etc.
    */
   scale: number; 
}
