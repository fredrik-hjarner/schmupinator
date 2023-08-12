import type { IGameSpeed } from "./IGameSpeed";
import type { TInitParams } from "../IService";
import type { IGameLoop } from "../GameLoop/IGameLoop";
import type { Settings } from "../Settings/Settings";

import { Button } from "./components/button.ts";
import { resolutionHeight } from "../../../consts.ts";
import { Destroyables } from "../../../utils/helperClasses/Destroyables.ts";

type TConstructor = {
   name: string;
}

type TCreateIncrFrameButtonParams =  { frames: number, left: number };
type TCreateFrameMultiplierButtonParams =  { multiplier: number, left: number };

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

   /**
    * Util to create the frame multiplier buttons, and adds it to this.destroyables.
    */
   private createFrameMultiplierButton = (params: TCreateFrameMultiplierButtonParams) => {
      const { multiplier, left } = params;
      const button = new Button({
         text: `${multiplier}x`,
         left,
         top: resolutionHeight + 79,
         onClick: () => {
            this.gameLoop.frameSpeedMultiplier = multiplier;
         }}
      );
      // auto-add this to destroyables.
      this.destroyables.add(button);
   };

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
      // TODO: Better type checking.
      this.gameLoop = deps?.gameLoop!;
      this.settings = deps?.settings!;
      /* eslint-enable @typescript-eslint/no-non-null-asserted-optional-chain */

      this.render();
   };

   public destroy = () => {
      this.destroyables.destroy();
   };

   private render = () => {
      const inDiff = 26;
      this.createIncrFrameButton({ left: 5+inDiff*0, frames: 1 });
      this.createIncrFrameButton({ left: 5+inDiff*1, frames: 2 });
      this.createIncrFrameButton({ left: 5+inDiff*2, frames: 5 });
      this.createIncrFrameButton({ left: 5+inDiff*3, frames: 10 });
      this.createIncrFrameButton({ left: 115, frames: 100 });

      const frDiff = 27;
      this.createFrameMultiplierButton({ left: 5+frDiff*0, multiplier: 0 });
      this.createFrameMultiplierButton({ left: 5+frDiff*1, multiplier: 1 });
      this.createFrameMultiplierButton({ left: 5+frDiff*2, multiplier: 2 });
      this.createFrameMultiplierButton({ left: 5+frDiff*3, multiplier: 3 });
      this.createFrameMultiplierButton({ left: 5+frDiff*4, multiplier: 4 });
      this.createFrameMultiplierButton({ left: 5+frDiff*5, multiplier: 5 });

      const { skipStartMenu } =  this.settings.settings;
      this.destroyables.add(
         new Button({
            text: skipStartMenu ? "unskip start menu" : "skip start menu",
            left: 5,
            top: resolutionHeight + 30,
            onClick: () => {
               this.settings.toggleSetting("skipStartMenu");
               this.refresh();  // refresh to values are up-to-date.
            }}
         )
      );
   };

   /**
    * When I have updated a setting I need to refresh so that new values can be seen,
    * so that the values are up-to-date.
    */
   private refresh = () => {
      this.destroy();
      this.render();
   };
}
