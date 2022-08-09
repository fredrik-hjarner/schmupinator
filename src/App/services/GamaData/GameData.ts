import type { IService } from "../IService";
import type { Document } from "yaml";

import { parseDocument } from "yaml";
import { loadAsync } from "jszip";

import { IEnemyJson } from "../Enemies/enemyConfigs/IEnemyJson";
import { BrowserDriver } from "../../../drivers/BrowserDriver";
//@ts-ignore: Dont know how to make ts not complain here where importing a zip.
import game1 from "../../../assets/game1.zip";
//@ts-ignore: Dont know how to make ts not complain here where importing a zip.
import game2 from "../../../assets/game2.zip";

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

   public Init = async () => {
      this.games["game1"] = await this.loadZip(game1 as string);
      this.games["game2"] = await this.loadZip(game2 as string);
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

   /**
    * Private
    */
   private loadZip = async (zipUrl: string): Promise<TEnemyJsons> => {
      const zipData = await BrowserDriver.FetchBinary(zipUrl);
      const zip = await loadAsync(zipData);

      const commonFile = await zip.file("common.yaml")?.async("text");
      // const commonDoc = commonFile ? parseDocument(commonFile, {merge: true}) : undefined;
      // if(commonDoc) { this.checkError(commonDoc); }

      const files: string[] = Object.keys(zip.files)
         .filter(f => f.includes(".yaml"));

      // console.log('files:', files);

      const allOtherFiles = await Promise.all(
         files
            .filter(f => f !== "common.yaml")
            .map(async (f) => {
               const yml = await zip.file(f)?.async("text");
               if(!yml) {
                  const err = `GameData: Failed to unzip ${f}`;
                  BrowserDriver.Alert(err);
                  throw new Error(err);
               }
               return yml;
            })
      );

      const enemyYaml = allOtherFiles.reduce<string[]>((acc, f) => {
         return [...acc, ...f.split("---")];
      }, []);
      // console.log("enemyYaml:", enemyYaml);
      // console.log("enemyYaml.length:", enemyYaml.length);
      const yamlDocuments = enemyYaml.map(yaml => {
         const withCommon = commonFile ? `${commonFile}\n${yaml}` : yaml;
         // console.log("withCommon:", withCommon);
         // console.log("//////////////////////////\n\n\n\n\n\n:");
         const yamlDocument = parseDocument(withCommon, {merge: true});
         this.checkError(yamlDocument);
         return parseDocument(withCommon, {merge: true});
      });

      // Check errors
      // yamlDocuments.forEach(this.checkError);

      const result: TEnemyJsons = {};

      // Populate enemies data structure.
      yamlDocuments.forEach((yamlsDocument: { toJS: () => { enemy: IEnemyJson } }) => {
         // console.log('yamlsDocument:', yamlsDocument);
         const yaml = yamlsDocument.toJS();
         // console.log('yaml:', yaml);
         if(!yaml?.enemy) {
            console.error(`Error: GameData service: Trying to add an empty enemy. Skipping.`);
            return;
         }
         result[yaml.enemy.name] = yaml.enemy as IEnemyJson;
      });

      // console.log("this.EnemyJsons:", this.EnemyJsons);
      return result;
   };

   private checkError = (yamlDocument: Document) => {
      const { errors } = yamlDocument;
      if(errors.length > 0) {
         BrowserDriver.Alert(JSON.stringify(errors, null, 2));
         throw errors;
      }
   };
}