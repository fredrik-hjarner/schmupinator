import type { IDestroyable } from "../../utils/types/IDestroyable";
import type { IService } from "./IService";

type TConstructor = {
   name: string;
}

export class NoopService implements IService, IDestroyable {
   public readonly name: string;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   public Init = async () => {
      // noop
   };

   public destroy = () => {
      // noop
   };
}
