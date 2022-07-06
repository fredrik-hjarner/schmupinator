import type { IService } from "../IService";
import type { Document } from "yaml";

// TODO: Must be some way to fix typescript imports when using es modules.
import { parseDocument } from "yaml";
import { loadAsync } from "jszip";

import { IEnemyJson } from "../Enemies/enemyConfigs/IEnemyJson";
import { BrowserDriver } from "../../../drivers/BrowserDriver";

type TConstructor = {
   name: string
}

export class Yaml implements IService {
   readonly name: string;
   /**
    * TODO: this should be a maop keyed by the enemy name.
    */
   EnemyJsons: IEnemyJson[];
   

   constructor({ name }: TConstructor) {
      this.name = name;
      this.EnemyJsons = [];
   }

   public Init = async () => {
      const zipData = await BrowserDriver.FetchBinary("/game.zip");
      const zip = await loadAsync(zipData);

      const commonFile = await zip.file("common.yaml")?.async("text");
      // const commonDoc = commonFile ? parseDocument(commonFile, {merge: true}) : undefined;
      // if(commonDoc) { this.checkError(commonDoc); }

      const files: string[] = Object.keys(zip.files);

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
         this.EnemyJsons.push(yaml.enemy as IEnemyJson);
      });

      // console.log("this.EnemyJsons:", this.EnemyJsons);
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