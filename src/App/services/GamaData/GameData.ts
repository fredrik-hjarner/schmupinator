import type { OverrideProperties } from "type-fest";
import type { IService } from "../IService";
import type { TGameObject } from "../../../gameTypes/TGameObject";
import type { TGame } from "@/gameTypes/TGame";

import game1 from "../../../gameData/game1/index.ts";
import game2 from "../../../gameData/game2/index.ts";
import asteroids from "../../../gameData/asteroids/index.ts";
import snake from "../../../gameData/snake/index.ts";

type TEnemyJsons = Partial<{ [enemyName: string]: TGameObject }>;

// TGame is used when creating a game, TInternalGame is used when executing the game.
type TInternalGame = OverrideProperties<TGame, { gameObjects: TEnemyJsons }>;
type TGames = TInternalGame[];

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
   private activeGame?: number;
   
   public constructor({ name }: TConstructor) {
      this.name = name;
      this.games = [];
      /**
       * TODO: activeGame should probably be undefined at the beginning??
       * I set it to "game1" just to make e2e tests in node to work faster.
       */
      this.activeGame = 0;
   }

   private addGame = (game: TGame) => {
      // key all enemies by name
      const gameObjects: Partial<{ [enemyName: string]: TGameObject; }> = {};
      for(const enemyJson of game.gameObjects) {
         gameObjects[enemyJson.name] = enemyJson;
      }

      this.games.push({
         name: game.name,
         gameObjects,
         startScreenImageUrl: game.startScreenImageUrl
      });
   };

   public Init = () => {
      this.addGame(game1);
      this.addGame(game2);
      this.addGame(asteroids);
      this.addGame(snake);

      return Promise.resolve(); // just to make typescript happy.
   };

   public setActiveGame = (game: number) => {
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
    * get list of games index such as ["0", "1", "2"]
    */
   public getGames = (): string[] => {
      return Object.keys(this.games);
   };

   /**
    * get list of games such as ["game1", "game2", "game3"]
    */
   public getGameNames = (): string[] => {
      return Object.values(this.games).map(g => g.name);
   };

   public GetEnemy = (enemyName: string): TGameObject  => {
      if(this.activeGame === undefined) {
         throw new Error("GameData.GetEnemy: Error activeGame is not set.");
      }
      /**
       * TODO: Code would be slightly faster if we stored the current game in a variable,
       * instead of looking it up every time.
       */
      const enemyJson = this.games[this.activeGame]?.gameObjects?.[enemyName];
      if(!enemyJson) {
         throw new Error(`GameData.GetEnemy: Unknown enemy "${enemyName}".`);
      }
      return enemyJson;
   };

   public getStartScreenImageUrl = (): TInternalGame["startScreenImageUrl"]  => {
      if(this.activeGame === undefined) {
         throw new Error("GameData.GetStartScreenImageUrl: Error activeGame is not set.");
      }
      const startScreenImageUrl = this.games[this.activeGame]?.startScreenImageUrl;
      if(!startScreenImageUrl) {
         throw new Error("GameData.GetStartScreenImageUrl: No startScreenImageUrl.");
      }
      return startScreenImageUrl;
   };
}
