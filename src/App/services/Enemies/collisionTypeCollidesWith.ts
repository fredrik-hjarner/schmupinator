/**
 * TODO: Remove this function and file. It is only temporary to get collisions working.
 */
export const collisionTypeCollidesWith = (
   collisionType: string,
   collisionTypes: string[]
): boolean => {
   switch(collisionType) {
      case "player":
         if(collisionTypes.includes("enemy")) {
            return true;
         }
         if(collisionTypes.includes("enemyBullet")) {
            return true;
         }
         return false;
      case "playerBullet":
         return collisionTypes.includes("enemy");
      case "enemy":
         return collisionTypes.includes("playerBullet");
      case "enemyBullet":
         return collisionTypes.includes("player");
      default:
         throw Error(`Unknown collisionType "${collisionType}"`);
   }
};