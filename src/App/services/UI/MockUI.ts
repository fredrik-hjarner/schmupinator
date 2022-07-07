import type { IUI } from "./IUI";

type TConstructor = {
   name: string
}

export class MockUI implements IUI {
   readonly name: string;

   constructor({ name }: TConstructor) {
      this.name = name;
   }

   public Init = async () => {
      //
   };
}