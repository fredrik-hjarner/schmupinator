import { BrowserDriver } from "../../../../drivers/BrowserDriver";

/**
 * End-user should be able to set attributes, they will be like variables,
 * that is why they need to be able to be of different types.
 * undefined will essentially be equal to "unsetting" an attribute.
 */
export type TAttributeValue = string | number | boolean;

export type TAttribute = Attribute;

class Attribute {
   public value: TAttributeValue;
   
   public constructor(value: TAttributeValue) {
      this.value = value;
      const type = typeof value;
      if(type === "string" || type === "number" || type === "boolean") {
         // noop
      } else {
         BrowserDriver.Alert(
            `Attribute.constructor: typeof value was "${type}" which is not an allowed type.`
         );
         throw new Error(
            `Attribute.constructor: typeof value was "${type}" which is not an allowed type.`
         );
      }
   }
}

export class Attributes {
   // Observe!! Object types like this should be in Partial<> to signal that keys may not exist.
   private attributes: Partial<Record<string, Attribute>> = {
      /**
       * Populate with some default attributes. Later I should probably set all of these with
       * actions, but it may not hurt to have default values though, and also may serve as
       * reference of what "built-in" attrs exist.
       */
      points:  { value: 10 },
      hp:      { value: 1 },
      maxHp:   { value: 1 },
      /**
       * Different things can and can't collide with each other.
       * none, enemy, enemyBullet, player, playerBullet.
       * (may add groundEnemy later).
       */
      collisionType: { value: "enemy" },
      // If should not be allowed to leave the game window.
      boundToWindow: { value: false },
   };

   private getAndAssertAttribute = (name: string): Attribute => {
      if(!(name in this.attributes)){
         const msg = `Attribute:  Attribute "${name}" does not exist.`;
         BrowserDriver.Alert(msg);
         throw new Error(msg);
      }
      //@ts-ignore guaranteed to exist since previous if case.
      return this.attributes[name];
   };

   public SetAttribute = (params: { name: string, value: TAttributeValue }) => {
      const {name, value} = params;
      this.attributes[name] = new Attribute(value);
   };

   public UnsetAttribute = (name: string) => {
      this.getAndAssertAttribute(name);
      delete this.attributes[name];
   };

   public GetAttribute = (name: string): Attribute => {
      return this.getAndAssertAttribute(name);
   };

   public attrExists = (name: string) => !!this.attributes[name];

   public incr = (name: string) => {
      const attr = this.getAndAssertAttribute(name);
      if(typeof attr.value !== "number") {
         const msg =
            `Attribute.incr: Tried to increment ${name} which is of type ${typeof attr.value}`;
         BrowserDriver.Alert(msg);
         throw new Error(msg);
      }
      attr.value++;
   };

   public decr = (name: string) => {
      const attr = this.getAndAssertAttribute(name);
      if(typeof attr.value !== "number") {
         const msg =
            `Attribute.decr: Tried to decrement ${name} which is of type ${typeof attr.value}`;
         BrowserDriver.Alert(msg);
         throw new Error(msg);
      }
      attr.value--;
   };
}