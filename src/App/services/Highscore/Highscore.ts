import type { IService, TInitParams } from "../IService";

import { BrowserDriver } from "../../../drivers/BrowserDriver";

const localStorageKey = "__highscore";

type THighscoreEntry = { name: string, score: number };

type TConstructor = {
   name: string,
   // top10 is only for testing, dont use it outside of tests.
   top10?: THighscoreEntry[]
}

export type TQualifiedForTop10 = {
   qualifiedForTop10: boolean;
   rank?: number;
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

   constructor({ name, top10 }: TConstructor) {
      this.name = name;
      if(top10) {
         this.top10 = top10;
      }
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (_deps?: TInitParams) => {
      // attempt to load from localStorage.
      BrowserDriver.WithWindow(window => {
         const fromLocalStorage = window.localStorage.getItem(localStorageKey);
         if(fromLocalStorage) {
            console.log("Highscore.Init: fromLocalStorage:");
            console.log(fromLocalStorage);
            this.top10 = JSON.parse(fromLocalStorage) as THighscoreEntry[];
         } else {
            // If not in localStorage then save the default in localStorage.
            console.log(
               "Highscore.Init: localStorage was empty. saving default top10 to localStorage."
            );
            window.localStorage.setItem(localStorageKey, JSON.stringify(this.top10));
         }
      });
   };

   public getTop1 = () => this.top10[0];
   public getTop10 = () => this.top10;

   public qualifiedForTop10 = (score: number): TQualifiedForTop10 => {
      let qualifiedForTop10 = false;
      let rank = undefined;
      for(let i=0; i<10; i++) {
         if(score > this.top10[i].score){
            qualifiedForTop10 = true;
            rank = i;
            break;
         }
      }
      return { qualifiedForTop10, rank };
   };

   // Assumably called from EnterHighscore scene when player has recorded name.
   public registerNewEntry = (entry: THighscoreEntry) => {
      const { rank } = this.qualifiedForTop10(entry.score);
      if(rank === undefined) {
         // If didn't rank then just return
         return;
      }

      // Add to top10 of this object.
      this.top10.splice(rank, 0, entry);
      this.top10 = this.top10.filter((_, i) => i < 10);

      // Write top10 of this object to localStorage.
      BrowserDriver.WithWindow(window => {
         window.localStorage.setItem(localStorageKey, JSON.stringify(this.top10));
      });
   };
}