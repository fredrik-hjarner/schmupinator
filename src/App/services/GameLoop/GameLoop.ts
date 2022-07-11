import type  { App } from "../../App";

import { millisPerFrame } from "../../../consts";
import {
   initLayer1Element, initGameHideBottom, initGameHideRight, initLayer2Element, initLayer3Element
} from "./gameDiv";
import { px } from "../../../utils/px";
import { IGameLoop } from "./IGameLoop";
import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { isHTMLDivElement } from "../../../utils/typeAssertions";

type TConstructor = {
   app: App;
   name: string;
};

export class GameLoop implements IGameLoop {
   public app: App;
   public name: string;
   public FrameCount: number;
   private readonly layer1Element: unknown;
   private readonly layer2Element: unknown;
   private readonly layer3Element: unknown;
   private nextFrameMillis: number | null;
   private startTime: number | null;

   /**
   * Public
   */
   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.FrameCount = 0;
      this.layer1Element = initLayer1Element();
      this.layer2Element = initLayer2Element();
      this.layer3Element = initLayer3Element();
      initGameHideBottom();
      initGameHideRight();
      this.nextFrameMillis = null;
      this.startTime = null;
   }

   public Init = async () => {
      // noop
   };

   public Start = () => {
      this.startTime = BrowserDriver.PerformanceNow();
      this.nextFrameMillis = BrowserDriver.PerformanceNow() + millisPerFrame;
      BrowserDriver.SetInterval(this.oneGameLoop, 0);
   };

   /**
   * Private
   */
   private nextFrame = () => {
      if(this.startTime === null) {
         BrowserDriver.Alert("this.startTime === null");
         throw new Error("this.startTime === null");
      }
      const gameSpeed = this.app.gameSpeed.GameSpeed;
      for(let i=0; i<gameSpeed; i++) {
         this.FrameCount++;
         this.app.events.dispatchEvent({ type: "frame_tick" });
         const baseSpeed = 1;
         const layer1YOffset: number = Math.round(this.FrameCount*baseSpeed * 0.3);
         const layer2YOffset: number = Math.round(this.FrameCount*baseSpeed);
         const layer3YOffset: number = Math.round(this.FrameCount*baseSpeed*1.5);
         if(
            isHTMLDivElement(this.layer1Element) &&
            isHTMLDivElement(this.layer2Element) &&
            isHTMLDivElement(this.layer3Element)
         ) {
            this.layer1Element.style.backgroundPositionY = px(layer1YOffset);
            this.layer2Element.style.backgroundPositionY = px(layer2YOffset);
            this.layer3Element.style.backgroundPositionY = px(layer3YOffset);
         }
      }
   };

   /**
   * This may not actually progress the game one frame.
   * Idea is to run these as fast as possible and to only progress a frame
   * when one frame has passed.
   */
   private oneGameLoop = () => {
      /**
       * This outer for loop is only because setInterval is so slow,
       * it might actually be slower than 60 setInterval per second.
       * It might not be necessary, and 3 is just an arbitrary number.
       */
      for(let i=0; i<3; i++) {
         if(this.nextFrameMillis === null) {
            BrowserDriver.Alert("this.nextFrameMillis === null");
            throw new Error("this.nextFrameMillis === null");
         }
         while (BrowserDriver.PerformanceNow() >= this.nextFrameMillis) {
            this.nextFrameMillis += millisPerFrame;
            this.nextFrame();
         }
      }
   };
}