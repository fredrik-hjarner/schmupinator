import type { IGameSpeed } from "../IGameSpeed";

type TConstructor = {
   name: string;
}

export class InvisibleGameSpeed implements IGameSpeed {
   name: string;
   private gameSpeed: number;

   /**
   * Public
   */
   constructor({ name }: TConstructor) {
      this.name = name;
      this.gameSpeed = 1;
   }

   Init = async () => {
      // noop
   };

   // nr of frames per 1/60 seconds.
   public get GameSpeed() {
      return this.gameSpeed;
   }

   // nr of frames per 1/60 seconds.
   public set GameSpeed(value: number) {
      this.gameSpeed = value;
   }
}
