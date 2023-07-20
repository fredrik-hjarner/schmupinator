import type { IEnemyJson } from "../../App/services/Enemies/enemyConfigs/IEnemyJson";

export const shot: IEnemyJson = {
   name: "shot",
   hp: 9999,
   diameter: 5,
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "enemyBullet" },
      { type: "setAttribute", attribute: "points", value: 0 },
      { type: "gfxSetShape", shape: "circle" }
   ]
};