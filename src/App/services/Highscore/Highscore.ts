import type { IService, TInitParams } from "../IService";

type THighscoreEntry = { name: string, score: number };

type TConstructor = {
   name: string
}

export class Highscore implements IService {
   readonly name: string;
   private top10: THighscoreEntry[] = [
      { name: "A", score: 10 },
      { name: "B", score: 9 },
      { name: "C", score: 8 },
      { name: "D", score: 7 },
      { name: "E", score: 6 },
      { name: "F", score: 5 },
      { name: "G", score: 4 },
      { name: "H", score: 3 },
      { name: "I", score: 2 },
      { name: "J", score: 1 },
   ];

   // deps/services

   constructor({ name }: TConstructor) {
      this.name = name;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (_deps?: TInitParams) => {
      // noop
   };

   public getTop1 = () => this.top10[0];
   public getTop10 = () => this.top10;
}