import type { IService, TInitParams } from "../IService";

type TConstructor = {
   name: string
}

export class Highscore implements IService {
   readonly name: string;

   // deps/services

   constructor({ name }: TConstructor) {
      this.name = name;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (_deps?: TInitParams) => {
      // noop
   };
}