import type  { App } from "../../../App";
import type { IGameLoop } from "../IGameLoop";

import { initLayer1Element, initGameHideBottom, initGameHideRight } from "../gameDiv";
import { px } from "../../../../utils/px";
import { isHTMLDivElement } from "../../../../utils/typeAssertions";
import { BrowserDriver } from "../../../../drivers/BrowserDriver";

type TConstructor = {
   app: App;
   name: string;
};

export class FastGameLoop implements IGameLoop {
   public app: App;
   public name: string;
   public FrameCount: number;
   private gameDiv: unknown;

   /**
   * Public
   */
   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.FrameCount = 0;
      this.gameDiv = initLayer1Element();
      initGameHideBottom();
      initGameHideRight();
   }

   Start = () => {
      setInterval(this.oneGameLoop, 0);
   };

   /**
   * Private
   */
   private nextFrame = () => {
      const gameSpeed = this.app.gameSpeed.GameSpeed;
      if(gameSpeed === 0) {
         return;
      }
      this.FrameCount++;
      this.app.events.dispatchEvent({ type: "frame_tick" });
      const bgPos: number = Math.round(this.FrameCount/2);
      if(isHTMLDivElement(this.gameDiv)) {
         this.gameDiv.style.backgroundPositionY = px(bgPos);
      }
   };

   private oneGameLoop = () => {
      const gameSpeed = this.app.gameSpeed.GameSpeed;
      if(gameSpeed === 0) {
         return;
      }
      for(let i=0; i<400; i++) {
         this.nextFrame();
      }
      console.log(BrowserDriver.PerformanceNow());
   };
}