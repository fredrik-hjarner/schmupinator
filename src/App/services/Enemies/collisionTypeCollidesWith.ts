/**
 * TODO: Remove this function and file. It is only temporary to get collisions working.
 */
export const collisionTypeCollidesWith = (
   collisionType: string,
   collisionTypes: string[]
): boolean => {
   switch(collisionType) {
      case "player":
         if(!collisionTypes.some(c => ["enemy", "enemyBullet"].includes(c))) {
            return false;
         }
         break;
      case "playerBullet":
         if(!collisionTypes.some(c => ["enemy"].includes(c))) {
            return false;
         }
         break;
      case "enemy":
         if(!collisionTypes.some(c => ["playerBullet"].includes(c))) {
            return false;
         }
         break;
      case "enemyBullet":
         if(!collisionTypes.some(c => ["player"].includes(c))) {
            return true;
         }
         break;
      default:
         throw Error(`Unknown collisionType "${collisionType}"`);
   }
   return true;
};