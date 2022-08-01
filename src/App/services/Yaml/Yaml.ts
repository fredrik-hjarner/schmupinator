import type { IService } from "../IService";
import type { Document } from "yaml";

import { parseDocument } from "yaml";
import { loadAsync } from "jszip";

import { IEnemyJson } from "../Enemies/enemyConfigs/IEnemyJson";
import { BrowserDriver } from "../../../drivers/BrowserDriver";
//@ts-ignore: Dont know how to make ts not complain here.
import gameZip from "../../../assets/game.zip";

type TConstructor = {
   name: string
}

export class Yaml implements IService {
   public readonly name: string;
   private EnemyJsons: Partial<{ [enemyName: string]: IEnemyJson }>;
   

   public constructor({ name }: TConstructor) {
      this.name = name;
      this.EnemyJsons = {};
   }

   public Init = async () => {
      const zipData = await BrowserDriver.FetchBinary(gameZip as string);
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
                  const err = `Yaml: Failed to unzip ${f}`;
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

      // Populate enemies data structure.
      yamlDocuments.forEach((yamlsDocument: { toJS: () => { enemy: IEnemyJson } }) => {
         // console.log('yamlsDocument:', yamlsDocument);
         const yaml = yamlsDocument.toJS();
         // console.log('yaml:', yaml);
         if(!yaml?.enemy) {
            console.error(`Error: Yaml service: Trying to add an empty enemy. Skipping.`);
            return;
         }
         this.EnemyJsons[yaml.enemy.name] = yaml.enemy as IEnemyJson;
      });

      // console.log("this.EnemyJsons:", this.EnemyJsons);
   };

   public GetEnemy = (enemyName: string): IEnemyJson | undefined  => {
      return this.EnemyJsons[enemyName];
   };

   /**
    * Private
    */
   private checkError = (yamlDocument: Document) => {
      const { errors } = yamlDocument;
      if(errors.length > 0) {
         BrowserDriver.Alert(JSON.stringify(errors, null, 2));
         throw errors;
      }
   };
}