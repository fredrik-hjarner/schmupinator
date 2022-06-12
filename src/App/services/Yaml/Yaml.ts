import type { App } from "../../App";

import type { IService } from "../IService";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { parse } from '../../../../node_modules/yaml/browser/dist/index';

import { firstMiniBoss1 } from "../Enemies/enemyConfigs/firstMiniBoss/firstMiniboss1";
import { firstMiniBoss2 } from "../Enemies/enemyConfigs/firstMiniBoss/firstMiniboss2";
import { IEnemyJson } from "../Enemies/enemyConfigs/IEnemyJson";
import { nonShootingAimer } from "../Enemies/enemyConfigs/nonShootingAimer/nonShootingAimer";
import { leftSinus } from "../Enemies/enemyConfigs/sinus/sinusLeft";
import { rightSinus } from "../Enemies/enemyConfigs/sinus/sinusRight";

type TConstructor = {
   app: App;
   name: string
}

export class Yaml implements IService {
   readonly app: App;
   readonly name: string;
   EnemyJsons: IEnemyJson[];
   

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.EnemyJsons = [
         // spawner,
         nonShootingAimer,
         leftSinus,
         rightSinus,
         firstMiniBoss1,
         firstMiniBoss2
      ];
   }

   Init = async () => {
      const res = await fetch("/yaml/spawner.yaml");
      const text = await res.text();
      // eslint-disable-next-line
      const yaml = parse(text) as any;
      // eslint-disable-next-line
      this.EnemyJsons.push(yaml.enemy as IEnemyJson);
   };
}