import type { IGraphics, TGraphicsAction, TGraphicsResponse } from "./IGraphics";

type TConstructor = { name: string };

export class MockGraphics implements IGraphics {
   public name: string;

   constructor({ name }: TConstructor) {
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
