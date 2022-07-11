import type { IUI } from "./IUI";

type TConstructor = {
   name: string
}

export class MockUI implements IUI {
   public readonly name: string;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   public Init = async () => {
      // noop. should show any UI for node/deno.
   };
}