import type { IGameEvents, TGameEvent } from "../Events/IEvents";
import type { TInitParams } from "../IService";

import {
   initLayer1Element, initGameHideBottom, initGameHideRight, initLayer2Element, initLayer3Element
} from "./divs";
import { px } from "../../../utils/px";
import { IParallax } from "./IParallax";
import { isHTMLDivElement } from "../../../utils/typeAssertions";

type TConstructor = {
   name: string;
};

export class Parallax implements IParallax {
   // vars
   public readonly name: string;

   // deps/services
   public events!: IGameEvents;

   // elements
   private readonly layer1Element: unknown;
   private readonly layer2Element: unknown;
   private readonly layer3Element: unknown;

   /**
   * Public
   */
   public constructor({ name }: TConstructor) {
      this.name = name;

      this.layer1Element = initLayer1Element();
      this.layer2Element = initLayer2Element();
      this.layer3Element = initLayer3Element();
      initGameHideBottom();
      initGameHideRight();
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      this.events = deps?.events as IGameEvents;
      this.events.subscribeToEvent(this.name, this.onEvent);
   };

   /**
   * Private
   */
   private onEvent = (event: TGameEvent) => {
      if(event.type !== "frame_tick") {
         return;
      }

      const baseSpeed = 1;
      const frame = event.frameNr;
      const layer1YOffset: number = Math.round(frame*baseSpeed * 0.3);
      const layer2YOffset: number = Math.round(frame*baseSpeed);
      const layer3YOffset: number = Math.round(frame*baseSpeed*1.5);
      if(
         isHTMLDivElement(this.layer1Element) &&
         isHTMLDivElement(this.layer2Element) &&
         isHTMLDivElement(this.layer3Element)
      ) {
         this.layer1Element.style.backgroundPositionY = px(layer1YOffset);
         this.layer2Element.style.backgroundPositionY = px(layer2YOffset);
         this.layer3Element.style.backgroundPositionY = px(layer3YOffset);
      }
   };
}