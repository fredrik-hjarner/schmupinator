import type  { App } from "../../../App";
import type { IGameLoop } from "../IGameLoop";

type TConstructor = {
   app: App;
   name: string;
};

export class NodeGameLoop implements IGameLoop {
   // vars
   public name: string;
   public FrameCount: number;
   public frameSpeedMultiplier: number; // 1 = normal spd. 0 = paused. 2 = twice spd etc.

   // deps/services
   public app: App;

   /**
   * Public
   */
   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.FrameCount = 0;
      this.frameSpeedMultiplier = 1;
   }

   public Init = async () => {
      // noop
   };

   public Start = async () => {
      for(let i=0; i<10_000_000; i++) {
         await this.oneGameLoop();
      }
   };

   public pause = () => {
      this.frameSpeedMultiplier = 0;
   };

   // Public because GameSpeed might want control over frames.
   public nextFrame = async () => {
      this.FrameCount++;
      await this.app.events.dispatchEvent({ type: "frame_tick", frameNr: this.FrameCount });
   };

   /**
   * Private
   */
   private advanceFrames = async () => {
      if(this.frameSpeedMultiplier === 0) {
         return;
      }
      await this.nextFrame();
   };

   private oneGameLoop = async () => {
      if(this.frameSpeedMultiplier === 0) {
         return;
      }
      await this.advanceFrames();
   };
}