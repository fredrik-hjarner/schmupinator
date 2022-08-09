import type { IService, TInitParams } from "../IService";
import type { GameData } from "../GamaData/GameData";

import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { isObject } from "../../../utils/typeAssertions";

const localStorageKey = "__highscore";
/**
 * The non-legacy version number i.e. current version.
 */
const latestVersion = 2;

type THighscores = {
   /**
    * In case I need to transform from an ealier format to a later format.
    */
   version?: number;
   games: Partial<Record<string, THighscoreEntry[]>>
}

type THighscoreEntry = { name: string, score: number };

type TConstructor = {
   name: string,
   // highscores is only for testing, dont use it outside of tests.
   highscores?: THighscores
}

export type TQualifiedForTop10 = {
   qualifiedForTop10: boolean;
   rank?: number;
}

export class Highscore implements IService {
   // vars
   public readonly name: string;
   /**
    * Initialized with a default value that is used if nothing else in localStorage.
    */
   private highscores: THighscores;

   // deps/services
   private gameData!: GameData;

   public constructor({ name, highscores }: TConstructor) {
      this.name = name;

      this.highscores = {
         version: latestVersion,
         games: {
            game1: this.defaultHighscore(),
            game2: this.defaultHighscore(),
         }
      };

      if(highscores) {
         this.highscores = highscores;
      }
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      this.gameData = deps?.gameData as GameData;

      // attempt to load from localStorage.
      BrowserDriver.WithWindow(window => {
         const fromLocalStorage = window.localStorage.getItem(localStorageKey);
         if(fromLocalStorage) {
            // console.log("Highscore.Init: fromLocalStorage:");
            // console.log(JSON.parse(fromLocalStorage));

            // If localStorage is an older version then skip it.
            const parsedfromLocalStorage = JSON.parse(fromLocalStorage) as unknown;
            if(isObject(parsedfromLocalStorage) && parsedfromLocalStorage?.version === 2) {
               this.highscores = parsedfromLocalStorage as THighscores;
            }
         } else {
            // If not in localStorage then save the default in localStorage.
            // console.log(
            //    "Highscore.Init: localStorage was empty. saving default top10 to localStorage."
            // );
            window.localStorage.setItem(localStorageKey, JSON.stringify(this.highscores));
         }
      });
   };

   public getTop1 = () => this.highscore[0];
   public getTop10 = () => this.highscore;

   public qualifiedForTop10 = (score: number): TQualifiedForTop10 => {
      let qualifiedForTop10 = false;
      let rank = undefined;
      for(let i=0; i<10; i++) {
         if(score > this.highscore[i].score){
            qualifiedForTop10 = true;
            rank = i;
            break;
         }
      }
      return { qualifiedForTop10, rank };
   };

   // Assumably called from EnterHighscore scene when player has recorded name.
   public registerNewEntry = (entry: THighscoreEntry) => {
      entry.score = Math.round(entry.score);
      const { rank } = this.qualifiedForTop10(entry.score);
      if(rank === undefined) {
         // If didn't rank then just return
         return;
      }

      // Add to top10 of this object.
      let highscore = this.highscore;
      highscore.splice(rank, 0, entry);
      highscore = highscore.filter((_, i) => i < 10);
      this.highscores.games[this.gameData.getAndAssertActiveGame()] = highscore;

      // console.log(
      //    "Highscore.registerNewEntry: persist new highscores to localStorage: ",
      //    this.highscores
      // );

      // Write top10 of this object to localStorage.
      BrowserDriver.WithWindow(window => {
         window.localStorage.setItem(localStorageKey, JSON.stringify(this.highscores));
      });
   };

   private defaultHighscore = (): THighscoreEntry[] => {
      return Array(10).fill(0).map(() => ({ name: "_____", score: 0 }));
   };

   private get highscore(): THighscoreEntry[] {
      const highscore = this.highscores.games[this.gameData.getAndAssertActiveGame()];
      if(highscore === undefined) {
         throw new Error("Highscore.highscore: failed to get highscore.");
      }
      return highscore.slice();
   }
}