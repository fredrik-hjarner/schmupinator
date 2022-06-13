import type  { App } from "../../../App";
import type { IGameLoop } from "../IGameLoop";

import { initGameDiv, initGameHideBottom, initGameHideRight } from "../gameDiv";
import { px } from "../../../../utils/px";

type TConstructor = {
   app: App;
   name: string;
};

export class FastGameLoop implements IGameLoop {
   public app: App;
   public name: string;
   public FrameCount: number;
   private gameDiv: HTMLDivElement;

   /**
   * Public
   */
   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.FrameCount = 0;
      this.gameDiv = initGameDiv();
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
      this.gameDiv.style.backgroundPositionY = px(bgPos);
   };

   private oneGameLoop = () => {
      const gameSpeed = this.app.gameSpeed.GameSpeed;
      if(gameSpeed === 0) {
         return;
      }
      for(let i=0; i<400; i++) {
         this.nextFrame();
      }
      console.log(performance.now());
   };
}