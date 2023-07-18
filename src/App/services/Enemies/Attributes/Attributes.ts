import { BrowserDriver } from "../../../../drivers/BrowserDriver";

/**
 * End-user should be able to set attributes, they will be like variables,
 * that is why they need to be able to be of different types.
 * undefined will essentially be equal to "unsetting" an attribute.
 *
 * TODO: Update comment.
 */
export type TAttributeValue = string | number | boolean;

// export type TAttribute = Attribute;

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
   gameObjects: {
      // [gameObjectId: string]: {
         points: number;
         pointsOnDeath: number;
         // hp?: number;
         // maxHp?: number;
         /**
          * TODO: The type of collision type should prolly be somewhere else since it is needed in
          * other places
          */
         collisionType: "none" | "enemy" | "enemyBullet" | "player" | "playerBullet";
         boundToWindow: boolean;
         [attribute: string]: TAttributeValue;
      // }
   }
};

export class Attributes {
   // Observe!! Object types like this should be in Partial<> to signal that keys may not exist.
   private attributes: TAttributes = {
      gameObjects: {
         /**
          * Populate with some default attributes. Later I should probably set all of these with
          * actions, but it may not hurt to have default values though, and also may serve as
          * reference of what "built-in" attrs exist.
          */
         // how many points you get when this enemy collides.
         points:        10,
         // how many points you get when this dies.
         pointsOnDeath: 0,
         // hp:            1, // I should not need a default value for this.
         // maxHp:         1, // I should not need a default value for this.
         /**
          * Different things can and can't collide with each other.
          * none, enemy, enemyBullet, player, playerBullet.
          * (may add groundEnemy later).
          */
         collisionType: "enemy",
         // If should not be allowed to leave the game window.
         boundToWindow: false,
      }
   };

   private getAndAssertAttribute = (name: string): TAttributeValue => {
      if(!(name in this.attributes.gameObjects)){
         const msg = `Attribute:  Attribute "${name}" does not exist.`;
         console.error(msg);
      }
      // guaranteed to exist since previous if case.
      return this.attributes.gameObjects[name];
   };

   public SetAttribute = (params: { name: string, value: TAttributeValue }) => {
      const {name, value} = params;
      this.attributes.gameObjects[name] = value;
   };

   // public UnsetAttribute = (name: string) => {
   //    this.getAndAssertAttribute(name);
   //    delete this.attributes[name];
   // };

   public GetAttribute = (name: string): TAttributeValue => {
      return this.getAndAssertAttribute(name);
   };

   // public attrExists = (name: string): boolean => !!this.attributes.gameObjects[name];

   public incr = (name: string) => {
      const attr = this.getAndAssertAttribute(name);
      if(typeof attr !== "number") {
         const msg =
            `Attribute.incr: Tried to increment ${name} which is of type ${typeof attr}`;
         BrowserDriver.Alert(msg);
         throw new Error(msg);
      }
      // as number, because I did check that if if case above.
      (this.attributes.gameObjects[name] as number)++;
   };

   public decr = (name: string) => {
      const attr = this.getAndAssertAttribute(name);
      if(typeof attr !== "number") {
         const msg =
            `Attribute.decr: Tried to decrement ${name} which is of type ${typeof attr}`;
         BrowserDriver.Alert(msg);
         throw new Error(msg);
      }
      // as number, because I did check that if if case above.
      (this.attributes.gameObjects[name] as number)--;
   };
}