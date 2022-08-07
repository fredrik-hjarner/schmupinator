import type { IDestroyable } from "../../utils/types/IDestroyable";
import type { IService } from "./IService";

export class NoopService implements IService, IDestroyable {
   public readonly name = "noop";

   public Init = async () => {
      // noop
   };

   public destroy = () => {
      // noop
   };
}
