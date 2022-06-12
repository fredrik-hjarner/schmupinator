import type { App } from "../../App";
import type { IService } from "../IService";
import type { Document, parseAllDocuments } from "yaml";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { parseAllDocuments as parse } from "../../../../node_modules/yaml/browser/dist/index";

import { firstMiniBoss1 } from "../Enemies/enemyConfigs/firstMiniBoss/firstMiniboss1";
import { firstMiniBoss2 } from "../Enemies/enemyConfigs/firstMiniBoss/firstMiniboss2";
import { IEnemyJson } from "../Enemies/enemyConfigs/IEnemyJson";

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
      this.EnemyJsons = [
         firstMiniBoss1,
         firstMiniBoss2
      ];
   }

   Init = async () => {
      const res = await fetch("/yaml/enemies.yaml");
      const text = await res.text();
      const yamlDocuments = (parse as typeof parseAllDocuments)(text, {merge: true}) as Document[];
      // console.log('yamlsDocuments:', yamlDocuments);

      // Check errors
      yamlDocuments.forEach((yamlsDocument) => {
         const { errors } = yamlsDocument;
         if(errors.length > 0) {
            alert(JSON.stringify(errors, null, 2));
            throw errors;
         }
      });

      // Populate enemies data structure.
      yamlDocuments.forEach((yamlsDocument: { toJS: () => { enemy: IEnemyJson } }) => {
         // console.log('yamlsDocument:', yamlsDocument);
         const yaml = yamlsDocument.toJS();
         // console.log('yaml:', yaml);
         this.EnemyJsons.push(yaml.enemy as IEnemyJson);
      });

      // console.log('this.EnemyJsons:', this.EnemyJsons);
   };
}