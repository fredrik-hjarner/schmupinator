import type { OverrideProperties } from "type-fest";
import type { IService } from "../IService";
import type { IEnemyJson } from "../../../gameTypes/IEnemyJson";
import type { TGame } from "@/gameTypes/TGame";

import game1 from "../../../gameData/game1/index";
import game2 from "../../../gameData/game2/index";

type TEnemyJsons = Partial<{ [enemyName: string]: IEnemyJson }>;

// TGame is used when creating a game, TInternalGame is used when executing the game.
type TInternalGame = OverrideProperties<TGame, { gameObjects: TEnemyJsons }>;
type TGames = Partial<{ [gameName: string]: TInternalGame }>

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
      const gameObjects1 = game1.gameObjects.reduce((acc: TEnemyJsons, enemyJson: IEnemyJson) => {
         acc[enemyJson.name] = enemyJson;
         return acc;
      }, {});
      this.games["game1"] = {
         gameObjects: gameObjects1,
         startScreenImageUrl: game1.startScreenImageUrl
      };

      /**
       * Game 2
       */
      // key all enemies by name
      const gameObjects2 = game2.gameObjects.reduce((acc: TEnemyJsons, enemyJson: IEnemyJson) => {
         acc[enemyJson.name] = enemyJson;
         return acc;
      }, {});
      this.games["game2"] = {
         gameObjects: gameObjects2,
         startScreenImageUrl: game2.startScreenImageUrl
      };

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
      const enemyJson =  this.games[this.activeGame]?.gameObjects?.[enemyName];
      if(!enemyJson) {
         throw new Error(`GameData.GetEnemy: Unknown enemy "${enemyName}".`);
      }
      return enemyJson;
   };
}
