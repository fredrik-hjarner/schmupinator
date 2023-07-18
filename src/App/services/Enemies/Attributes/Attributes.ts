import { BrowserDriver } from "../../../../drivers/BrowserDriver";

/**
 * End-user should be able to set attributes, they will be like variables,
 * that is why they need to be able to be of different types.
 */
export type TAttrValue = string | number | boolean;

// class Attribute {
//    public value: TAttributeValue;
   
//    public constructor(value: TAttributeValue) {
//       this.value = value;
//       const type = typeof value;
//       if(type === "string" || type === "number" || type === "boolean") {
//          // noop
//       } else {
//          BrowserDriver.Alert(
//             `Attribute.constructor: typeof value was "${type}" which is not an allowed type.`
//          );
//          throw new Error(
//             `Attribute.constructor: typeof value was "${type}" which is not an allowed type.`
//          );
//       }
//    }
// }

type TAttributes = {
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

type TGameObjectIdAndAttrParams = { gameObjectId: string, attribute: string };
type TGetAttrParams = { gameObjectId: string, attribute: string };
type TSetAttrParams = { gameObjectId: string, attribute: string, value: TAttrValue };
type TIncrDecrAttrParams = { gameObjectId: string, attribute: string };

export class Attributes {
   // Observe!! Object types like this should be in Partial<> to signal that keys may not exist.
   private attributes: TAttributes = {
      gameObjects: {}
   };

   private getAndAssertAttribute = ({ gameObjectId, attribute }: TGetAttrParams): TAttrValue => {
      const value = this.attributes.gameObjects[gameObjectId]?.[attribute];
      if(value === undefined){
         const msg = `Attribute:  Attribute "${attribute}" does not exist.`;
         console.error(msg);
      }
      // guaranteed to exist since previous if case.
      return value as TAttrValue;
   };

   public SetAttribute = ({ gameObjectId, attribute, value }: TSetAttrParams) => {
      const attrs = this.attributes.gameObjects[gameObjectId];
      if (attrs !== undefined) {
         attrs[attribute] = value;
         return;
      }
      // init if it did not exist.
      this.attributes.gameObjects[gameObjectId] = {
         [attribute]: value
      };
   };

   // public UnsetAttribute = (name: string) => {
   //    this.getAndAssertAttribute(name);
   //    delete this.attributes[name];
   // };

   public GetAttribute = (params: TGameObjectIdAndAttrParams): TAttrValue => {
      return this.getAndAssertAttribute(params);
   };

   // public attrExists = (name: string): boolean => !!this.attributes.gameObjects[name];

   public incr = (params: TIncrDecrAttrParams) => {
      const attr = this.getAndAssertAttribute(params);
      if(typeof attr !== "number") {
         const msg =
            "Attribute.incr: Tried to increment " +
            `${params.attribute} which is of type ${typeof params.attribute}`;
         BrowserDriver.Alert(msg);
         throw new Error(msg);
      }
      // as number, because I did check that if if case above.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (this.attributes.gameObjects[params.gameObjectId]![params.attribute] as number)++;
   };

   public decr = (params: TIncrDecrAttrParams) => {
      const attr = this.getAndAssertAttribute(params);
      if(typeof attr !== "number") {
         const msg =
            "Attribute.decr: Tried to decrement" +
            `${params.attribute} which is of type ${typeof params.attribute}`;
         BrowserDriver.Alert(msg);
         throw new Error(msg);
      }
      // as number, because I did check that if if case above.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (this.attributes.gameObjects[params.gameObjectId]![params.attribute] as number)--;
   };
}