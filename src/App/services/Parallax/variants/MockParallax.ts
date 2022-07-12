import { IParallax } from "../IParallax";

type TConstructor = {
   name: string;
};

export class MockParallax implements IParallax {
   public readonly name: string;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   public Init = async () => {
      // noop
   };
}