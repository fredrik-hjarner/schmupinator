import type { IFullscreen } from "../IFullscreen";

type TConstructor = {
   name: string;
}

export class MockFullscreen implements IFullscreen {
   public readonly name: string;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   public Init = async () => {
      //
   };
}
