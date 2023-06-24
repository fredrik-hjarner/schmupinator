import type { Document } from "yaml";

import { parseDocument } from "yaml";
import { loadAsync } from "jszip";

import { IEnemyJson } from "../Enemies/enemyConfigs/IEnemyJson";
import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { transformActions } from "../Enemies/actions/transform";

// TODO: This type is duplicated.
type TEnemyJsons = Partial<{ [enemyName: string]: IEnemyJson }>;

// helper function
const checkError = (yamlDocument: Document) => {
   const { errors } = yamlDocument;
   if(errors.length > 0) {
      BrowserDriver.Alert(JSON.stringify(errors, null, 2));
      throw errors;
   }
};

// loads a zip with yaml files from url and returns a map of enemy names to enemy jsons.
export const loadYamlZip = async (zipUrl: string): Promise<TEnemyJsons> => {
   const zipData = await BrowserDriver.FetchBinary(zipUrl);
   const zip = await loadAsync(zipData);

   const commonFile = await zip.file("common.yaml")?.async("text");
   // const commonDoc = commonFile ? parseDocument(commonFile, {merge: true}) : undefined;
   // if(commonDoc) { checkError(commonDoc); }

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
      checkError(yamlDocument);
      return parseDocument(withCommon, {merge: true});
   });

   // Check errors
   // yamlDocuments.forEach(checkError);

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
      const enemyJson = yaml.enemy as IEnemyJson;
      result[yaml.enemy.name] = enemyJson;
      /**
       * transform all actions to, so called, long form actions.
       * This transformation happens here because this is the entry point
       * no TShortFormAction lives after this point, only TAction.
       */
      if(enemyJson.actions !== undefined) {
         transformActions(enemyJson.actions);
      }
      if(enemyJson.onDeathAction !== undefined) {
         transformActions([enemyJson.onDeathAction]);
      }
   });

   return result;
};
