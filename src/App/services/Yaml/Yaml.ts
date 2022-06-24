import type { App } from "../../App";
import type { IService } from "../IService";
import type { Document } from "yaml";

// TODO: Must be some way to fix typescript imports when using es modules.
import { parseDocument } from "yaml";
import { loadAsync } from "jszip";

import { IEnemyJson } from "../Enemies/enemyConfigs/IEnemyJson";
import { BrowserDriver } from "../../../drivers/BrowserDriver";

type TConstructor = {
   app: App;
   name: string
}

export class Yaml implements IService {
   readonly app: App;
   readonly name: string;
   /**
    * TODO: this should be a maop keyed by the enemy name.
    */
   EnemyJsons: IEnemyJson[];
   

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.EnemyJsons = [];
   }

   Init = async () => {
      const zipData = await BrowserDriver.FetchBinary("yaml/game.zip");
      // console.log("zipData:", zipData);
      const zip = await loadAsync(zipData);
      // console.log("zip:", zip);

      const common = await zip.file("common.yaml")?.async("text");
      const enemies = await zip.file("enemies.yaml")?.async("text");

      if(!common) {
         BrowserDriver.Alert("Yaml: Failed to load common.yml");
         throw new Error("Yaml: Failed to load common.yml");
      }
      if(!enemies) {
         BrowserDriver.Alert("Yaml: Failed to load enemies.yml");
         throw new Error("Yaml: Failed to load enemies.yml");
      }

      const commonDoc = parseDocument(common, {merge: true});

      // Check errors
      this.checkError(commonDoc);

      const enemyYaml = enemies.split("---");
      const yamlDocuments = enemyYaml.map(yaml => {
         const withCommon = `${common}\n${yaml}`;
         return parseDocument(withCommon, {merge: true});
      });

      // Check errors
      yamlDocuments.forEach(this.checkError);

      // Populate enemies data structure.
      yamlDocuments.forEach((yamlsDocument: { toJS: () => { enemy: IEnemyJson } }) => {
         // console.log('yamlsDocument:', yamlsDocument);
         const yaml = yamlsDocument.toJS();
         // console.log('yaml:', yaml);
         this.EnemyJsons.push(yaml.enemy as IEnemyJson);
      });

      // console.log('this.EnemyJsons:', this.EnemyJsons);
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