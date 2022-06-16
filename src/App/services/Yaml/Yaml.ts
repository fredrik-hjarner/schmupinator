import type { App } from "../../App";
import type { IService } from "../IService";
import type { Document, parseDocument } from "yaml";

import {
   parseDocument as parseDoc
   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
   // @ts-ignore
} from "../../../../node_modules/yaml/browser/dist/index";

import { IEnemyJson } from "../Enemies/enemyConfigs/IEnemyJson";

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
      const [common, enemies] = await Promise.all([
         this.loadYaml("/yaml/common.yaml"),
         this.loadYaml("/yaml/enemies.yaml")
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
         alert(JSON.stringify(errors, null, 2));
         throw errors;
      }
   };

   private loadYaml = async (url: string): Promise<string> => {
      const res = await fetch(url);
      return await res.text();
   };
}