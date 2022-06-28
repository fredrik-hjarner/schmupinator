import type { App } from "../../App";
import type { IUI } from "./IUI";

type TConstructor = {
   app: App;
   name: string
}

export class MockUI implements IUI {
   readonly app: App;
   readonly name: string;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
   }

   public Init = async () => {
      //
   };
}