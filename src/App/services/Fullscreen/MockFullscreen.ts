import type { IFullscreen } from "./IFullscreen";

type TConstructor = {
   name: string;
}

export class MockFullscreen implements IFullscreen {
   public readonly name: string;
   public scale = 1;

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
