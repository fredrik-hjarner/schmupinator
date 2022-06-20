import type { App } from "../../App";
import type { IService } from "../IService";
import type { Document, parseDocument } from "yaml";

// TODO: Must be some way to fix typescript imports when using es modules.
import {
   parseDocument as parseDocBrowser
   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
   // @ts-ignore
} from "../../../../node_modules/yaml/browser/dist/index";

import { IEnemyJson } from "../Enemies/enemyConfigs/IEnemyJson";
import { BrowserDriver, IsBrowser } from "../../../drivers/BrowserDriver";

type TParseDocument = typeof parseDocument;

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
      // TODO: Must be some way to fix typescript imports when using es modules.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parseDoc = IsBrowser() ? parseDocBrowser : (await import("yaml")).parseDocument;

      const [common, enemies] = await Promise.all([
         this.loadYaml("yaml/common.yaml"),
         this.loadYaml("yaml/enemies.yaml")
      ]);

      const commonDoc = (parseDoc as TParseDocument)(common, {merge: true}) as Document;

      // Check errors
      this.checkError(commonDoc);

      const enemyYaml = enemies.split("---");
      const yamlDocuments = enemyYaml.map(yaml => {
         const withCommon = `${common}\n${yaml}`;
         return (parseDoc as TParseDocument)(withCommon, {merge: true}) as Document;
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

   private loadYaml = async (url: string): Promise<string> => {
      return await BrowserDriver.Fetch(url);
   };
}