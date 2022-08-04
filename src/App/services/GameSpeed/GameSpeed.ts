import type { IGameSpeed } from "./IGameSpeed";
import type { TInitParams } from "../IService";

import { isHTMLInputElement } from "../../../utils/typeAssertions";
import { initGameSpeedSlider } from "./components/gameSpeedSlider";
import { createButton } from "../UI/Scenes/components/atoms/button";
import { resolutionHeight } from "../../../consts";
import { GameLoop } from "../GameLoop/GameLoop";

type TConstructor = {
   name: string;
}

type TCreateIncrFrameButtonParams =  { frames: number, left: number };

export class GameSpeed implements IGameSpeed {
   public readonly name: string;

   // deps/services
   public gameLoop!: GameLoop;

   // elements
   private gameSpeedElement: unknown;
   private pausePlayButton?: HTMLButtonElement;
   private fwd1Frame?: HTMLButtonElement;
   private fwd2Frames?: HTMLButtonElement;
   private fwd5Frames?: HTMLButtonElement;
   private fwd10Frames?: HTMLButtonElement;
   private fwd100Frames?: HTMLButtonElement;

   /**
   * Public
   */
   public constructor({ name }: TConstructor) {
      this.name = name;
      this.gameSpeedElement = initGameSpeedSlider();
   }

   /**
    * Util to create the incr frames buttons.
    */
   private createIncrFrameButton = (params: TCreateIncrFrameButtonParams): HTMLButtonElement => {
      const { frames, left } = params;
      return createButton({
         text: `+${frames}`,
         left,
         top: resolutionHeight + 55,
         onClick: () => {
            for(let i=0; i<frames; i++) {
               this.gameLoop.nextFrame();
            }
         }}
      );
   };

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      this.gameLoop = deps?.gameLoop as GameLoop;

      this.pausePlayButton = createButton({
         text: "Pause/Play",
         left: 5,
         top: resolutionHeight + 55,
         onClick: () => {
            if(this.GameSpeed === 0) {
               this.GameSpeed = 1;
            } else {
               this.GameSpeed = 0;
            }
         }}
      );

      this.fwd1Frame = this.createIncrFrameButton({ left: 76, frames: 1 });
      this.fwd2Frames = this.createIncrFrameButton({ left: 102, frames: 2 });
      this.fwd5Frames = this.createIncrFrameButton({ left: 128, frames: 5 });
      this.fwd10Frames = this.createIncrFrameButton({ left: 154, frames: 10 });
      this.fwd100Frames = this.createIncrFrameButton({ left: 185, frames: 100 });
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

   public destroy = () => {
      /**
       * TODO: Also destroy gameSpeedElement here, but first gameSpeedElement must be created here
       * instead of being in index.html file.
       */

      this.pausePlayButton?.remove();
      this.pausePlayButton = undefined;

      this.fwd1Frame?.remove();
      this.fwd1Frame = undefined;

      this.fwd2Frames?.remove();
      this.fwd2Frames = undefined;

      this.fwd5Frames?.remove();
      this.fwd5Frames = undefined;

      this.fwd10Frames?.remove();
      this.fwd10Frames = undefined;

      this.fwd100Frames?.remove();
      this.fwd100Frames = undefined;
   };
}
