import type { TInitParams } from "../IService";

import { initGameHideBottom, initGameHideRight } from "./divs";
import { IOutsideHider } from "./IOutsideHider";

type TConstructor = {
   name: string;
};

export class OutsideHider implements IOutsideHider {
   // vars
   public readonly name: string;

   // deps/services

   // elements

   /**
   * Public
   */
   public constructor({ name }: TConstructor) {
      this.name = name;

      initGameHideBottom();
      initGameHideRight();
   }

   public Init = async (_deps?: TInitParams) => {
      // noop
   };
}