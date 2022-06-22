import type { App } from "../../App";
import type { IGraphics, TGraphicsAction, TGraphicsResponse } from "./IGraphics";

type TConstructor = { app: App; name: string };

export class MockGraphics implements IGraphics {
   public app: App;
   public name: string;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
   }

   Init = async () => {
      // noop
   };

   public Dispatch = (_: TGraphicsAction): TGraphicsResponse => {
      // noop
      return { type: "responseVoid" };
   };
}
