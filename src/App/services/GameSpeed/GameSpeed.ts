import type { IGameSpeed } from "./IGameSpeed";

import { isHTMLInputElement } from "../../../utils/typeAssertions";
import { initGameSpeedElement } from "./gameSpeedElement";

type TConstructor = {
   name: string;
}

export class GameSpeed implements IGameSpeed {
   public readonly name: string;
   private gameSpeedElement: unknown;

   /**
   * Public
   */
   public constructor({ name }: TConstructor) {
      this.name = name;
      this.gameSpeedElement = initGameSpeedElement();
   }

   public Init = async () => {
      // noop
   };

   // nr of frames per 1/60 seconds.
   public get GameSpeed() {
      if(isHTMLInputElement(this.gameSpeedElement)) {
         const value = this.gameSpeedElement.value;
         return parseInt(value, 10);
      }
      return 1;
   }

   // nr of frames per 1/60 seconds.
   public set GameSpeed(value: number) {
      if(isHTMLInputElement(this.gameSpeedElement)) {
         this.gameSpeedElement.value = `${value}`;
      }
   }
}
