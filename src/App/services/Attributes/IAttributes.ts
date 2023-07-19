import type { IService } from "../IService";
import type { IDestroyable } from "../../../utils/types/IDestroyable";

/**
 * End-user should be able to set attributes, they will be like variables,
 * that is why they need to be able to be of different types.
 */
export type TAttrValue = string | number | boolean;

export type TAttributes = {
   gameObjects: Partial<{
      [gameObjectId: string]: Partial<{
         // how many points you get when this enemy collides.
         points: number;
         // how many points you get when this dies.
         pointsOnDeath: number;
         // hp?: number;
         // maxHp?: number;
         /**
          * TODO: The type of collision type should prolly be somewhere else since it is needed in
          * other places
          */
         /**
          * Different things can and can't collide with each other.
          * none, enemy, enemyBullet, player, playerBullet.
          * (may add groundEnemy later).
          */
         collisionType: "none" | "enemy" | "enemyBullet" | "player" | "playerBullet";
         // If should not be allowed to leave the game window. Player should be contrained to window
         boundToWindow: boolean;
         [attribute: string]: TAttrValue;
      }>
   }>
};

export type TGameObjectIdAndAttrParams = { gameObjectId: string, attribute: string };
export type TGetAttrParams = { gameObjectId: string, attribute: string };
export type TSetAttrParams = { gameObjectId: string, attribute: string, value: TAttrValue };
export type TIncrDecrAttrParams = { gameObjectId: string, attribute: string };

export interface IAttributes extends IService, IDestroyable {
   setAttribute: ({ gameObjectId, attribute, value }: TSetAttrParams) => void;
   getAttribute: (params: TGameObjectIdAndAttrParams) => TAttrValue;
   incr: (params: TIncrDecrAttrParams) => void;
   decr: (params: TIncrDecrAttrParams) => void;
}
