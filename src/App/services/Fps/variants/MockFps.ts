import type  { App } from "../../../App";
import type { IFps } from "../IFps";

type TConstructor = {
   app: App;
   name: string;
};

export class MockFps implements IFps {
   public app: App;
   public name: string;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
   }

   Init = async () => {
      // noop
   };
}