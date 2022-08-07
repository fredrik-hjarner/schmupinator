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
   private gameHideBottom?: HTMLDivElement;
   private gameHideRight?: HTMLDivElement;

   /**
   * Public
   */
   public constructor({ name }: TConstructor) {
      this.name = name;

      this.gameHideBottom = initGameHideBottom();
      this.gameHideRight = initGameHideRight();
   }

   public Init = async (_deps?: TInitParams) => {
      // noop
   };

   public destroy = () => {
      this.gameHideBottom?.remove();
      this.gameHideBottom = undefined;

      this.gameHideRight?.remove();
      this.gameHideRight = undefined;
   };
}