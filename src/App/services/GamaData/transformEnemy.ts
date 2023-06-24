import type { IEnemyJson } from "../Enemies/enemyConfigs/IEnemyJson";

import { transformActions } from "../Enemies/actions/transform";

export const transformEnemy = (enemyJson: IEnemyJson): IEnemyJson => {
   if(enemyJson.actions !== undefined) {
      transformActions(enemyJson.actions);
   }
   if(enemyJson.onDeathAction !== undefined) {
      transformActions([enemyJson.onDeathAction]);
   }
   return enemyJson;
};