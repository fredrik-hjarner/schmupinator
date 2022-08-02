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

   /**
   * Public
   */
   public constructor({ name }: TConstructor) {
      this.name = name;
      this.gameSpeedElement = initGameSpeedSlider();
   }

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

      this.fwd1Frame = createButton({
         text: "+1 frame",
         left: 76,
         top: resolutionHeight + 55,
         onClick: () => { this.gameLoop.nextFrame(); }}
      );

      this.fwd2Frames = createButton({
         text: "+2 frames",
         left: 137,
         top: resolutionHeight + 55,
         onClick: () => {
            this.gameLoop.nextFrame();
            this.gameLoop.nextFrame();
         }}
      );

      this.fwd5Frames = createButton({
         text: "+5 frames",
         left: 204,
         top: resolutionHeight + 55,
         onClick: () => {
            for(let i=0; i<5; i++) {
               this.gameLoop.nextFrame();
            }
         }}
      );
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
   };
}
