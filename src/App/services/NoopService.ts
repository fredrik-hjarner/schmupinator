import type { IService } from "./IService";

type TConstructor = {
   name: string;
}

export class NoopService implements IService {
   public readonly name: string;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   public Init = async () => {
      //
   };
}
