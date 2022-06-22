import type { App } from "../../App";
import type { IService } from "../IService";

import { isHTMLInputElement } from "../../../utils/typeAssertions";
import { initGameSpeedElement } from "./gameSpeedElement";

type TConstructor = {
   app: App;
   name: string;
}

export class GameSpeed implements IService {
   app: App;
   name: string;
   gameSpeedElement: unknown;

   /**
   * Public
   */
   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.gameSpeedElement = initGameSpeedElement();
   }

   Init = async () => {
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
