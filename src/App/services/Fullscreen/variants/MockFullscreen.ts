import type { IFullscreen } from "../IFullscreen";

type TConstructor = {
   name: string;
}

export class MockFullscreen implements IFullscreen {
   name: string;

   constructor({ name }: TConstructor) {
      this.name = name;
   }

   Init = async () => {
      //
   };
}
