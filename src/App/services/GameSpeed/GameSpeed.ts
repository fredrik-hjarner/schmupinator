import type { IGameSpeed } from "./IGameSpeed";
import type { TInitParams } from "../IService";
import type { IGameLoop } from "../GameLoop/IGameLoop";
import type { Settings } from "../Settings/Settings";

import { Button } from "./components/button";
import { resolutionHeight } from "../../../consts";
import { Destroyables } from "../../../utils/helperClasses/Destroyables";

type TConstructor = {
   name: string;
}

type TCreateIncrFrameButtonParams =  { frames: number, left: number };

export class GameSpeed implements IGameSpeed {
   // vars
   public readonly name: string;
   private destroyables: Destroyables;

   // deps/services
   public gameLoop!: IGameLoop;
   public settings!: Settings;

   // elements

   /**
   * Public
   */
   public constructor({ name }: TConstructor) {
      this.name = name;
      this.destroyables = new Destroyables();
   }

   /**
    * Util to create the incr frames buttons, and adds it to this.destroyables.
    */
   private createIncrFrameButton = (params: TCreateIncrFrameButtonParams) => {
      const { frames, left } = params;
      const button = new Button({
         text: `+${frames}`,
         left,
         top: resolutionHeight + 55,
         onClick: () => {
            for(let i=0; i<frames; i++) {
               this.gameLoop.nextFrame();
            }
         }}
      );
      // auto-add this to destroyables.
      this.destroyables.add(button);
   };

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      this.gameLoop = deps?.gameLoop as IGameLoop;
      this.settings = deps?.settings as Settings;

      this.destroyables.add(
         new Button({
            text: "Pause/Play",
            left: 5,
            top: resolutionHeight + 55,
            onClick: () => {
               if(this.gameLoop.frameSpeedMultiplier === 0) {
                  this.gameLoop.frameSpeedMultiplier = 1;
               } else {
                  this.gameLoop.frameSpeedMultiplier = 0;
               }
            }}
         )
      );

      this.createIncrFrameButton({ left: 76, frames: 1 });
      this.createIncrFrameButton({ left: 102, frames: 2 });
      this.createIncrFrameButton({ left: 128, frames: 5 });
      this.createIncrFrameButton({ left: 154, frames: 10 });
      this.createIncrFrameButton({ left: 185, frames: 100 });

      const { skipStartMenu } =  this.settings.settings;
      this.destroyables.add(
         new Button({
            text: skipStartMenu ? "unskip start menu" : "skip start menu",
            left: 251,
            top: resolutionHeight + 3,
            onClick: () => {
               this.settings.toggleSetting("skipStartMenu");
            }}
         )
      );
   };

   public destroy = () => {
      /**
       * TODO: Also destroy gameSpeedElement here, but first gameSpeedElement must be created here
       * instead of being in index.html file.
       */

      this.destroyables.destroy();
   };
}
