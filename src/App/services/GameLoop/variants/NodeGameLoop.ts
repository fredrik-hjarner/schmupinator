import type  { App } from "../../../App";
import type { IGameLoop } from "../IGameLoop";

import { BrowserDriver } from "../../../../drivers/BrowserDriver";

type TConstructor = {
   app: App;
   name: string;
};

export class NodeGameLoop implements IGameLoop {
   public app: App;
   public name: string;
   public FrameCount: number;

   /**
   * Public
   */
   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.FrameCount = 0;
   }

   public Init = async () => {
      // noop
   };

   public Start = () => {
      BrowserDriver.SetInterval(this.oneGameLoop, 0);
   };

   // Public because GameSpeed might want control over frames.
   public nextFrame = () => {
      this.FrameCount++;
      this.app.events.dispatchEvent({ type: "frame_tick", frameNr: this.FrameCount });
   };

   /**
   * Private
   */
   private advanceFrames = () => {
      const gameSpeed = this.app.gameSpeed.GameSpeed;
      if(gameSpeed === 0) {
         return;
      }
      this.nextFrame();
   };

   private oneGameLoop = () => {
      const gameSpeed = this.app.gameSpeed.GameSpeed;
      if(gameSpeed === 0) {
         return;
      }
      this.advanceFrames();
   };
}