import type  { App } from "../../../App";
import type { IFps } from "../IFps";

type TConstructor = {
   app: App;
   name: string;
};

export class MockFps implements IFps {
   public name: string;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   public Init = async () => {
      // noop
   };
}