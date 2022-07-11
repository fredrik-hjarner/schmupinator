import type { IGameSpeed } from "../IGameSpeed";

type TConstructor = {
   name: string;
}

export class InvisibleGameSpeed implements IGameSpeed {
   public readonly name: string;
   private gameSpeed: number;

   public constructor({ name }: TConstructor) {
      this.name = name;
      this.gameSpeed = 1;
   }

   public Init = async () => {
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
