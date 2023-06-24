import type { IService } from "../IService";

import { IEnemyJson } from "../Enemies/enemyConfigs/IEnemyJson";
// import { loadYamlZip } from "./loadZip"; // TODO: remove the corresponding code from loadZip.ts

import game1js from "../../../gameData/game1/index";
import game2js from "../../../gameData/game2/index";
import { transformEnemy } from "./transformEnemy";

type TEnemyJsons = Partial<{ [enemyName: string]: IEnemyJson }>;

type TGames = Partial<{ [gameName: string]: TEnemyJsons }>

type TConstructor = {
   name: string
}

export class GameData implements IService {
   public readonly name: string;
   /**
    * "games" are zip-files. games can contain levels, at least that's the idea later.
    */
   private games: TGames;
   /**
    * Keeps track of which "game" (zip-file) is active.
    */
   private activeGame?: string;
   
   public constructor({ name }: TConstructor) {
      this.name = name;
      this.games = {};
      /**
       * TODO: activeGame should probably be undefined at the beginning??
       * I set it to "game1" just to make e2e tests in node to work faster.
       */
      this.activeGame = "game1";
   }

   public Init = () => {
      /**
       * Game 1
       */
      // key all enemies by name
      this.games["game1"] = game1js.reduce((acc: TEnemyJsons, enemyJson: IEnemyJson) => {
         acc[enemyJson.name] = transformEnemy(enemyJson);
         return acc;
      }, {});

      /**
       * Game 2
       */
      this.games["game2"] = game2js.reduce((acc: TEnemyJsons, enemyJson: IEnemyJson) => {
         acc[enemyJson.name] = transformEnemy(enemyJson);
         return acc;
      }, {});

      return Promise.resolve(); // just to make typescript happy.
   };

   public setActiveGame = (game: string) => {
      this.activeGame = game;
   };
   public getActiveGame = () => {
      return this.activeGame;
   };
   public getAndAssertActiveGame = () => {
      if(this.activeGame === undefined) {
         throw new Error("GameData.getAndAssertActiveGame: activeGame is undefined.");
      }
      return this.activeGame;
   };

   /**
    * get list of games such as ["game1", "game2", "game3"]
    */
   public getGames = (): string[] => {
      return Object.keys(this.games);
   };

   public GetEnemy = (enemyName: string): IEnemyJson  => {
      if(!this.activeGame) {
         throw new Error("GameData.GetEnemy: Error activeGame is not set.");
      }
      const enemyJson =  this.games[this.activeGame]?.[enemyName];
      if(!enemyJson) {
         throw new Error(`GameData.GetEnemy: Unknown enemy "${enemyName}".`);
      }
      return enemyJson;
   };
}
