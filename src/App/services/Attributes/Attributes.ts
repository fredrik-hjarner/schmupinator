import type {
   IAttributes,
   TAttrValue,
   TAttributes,
   TGameObjectIdAndAttrParams,
   TGetAttrParams,
   TIncrDecrAttrParams,
   TSetAttrParams
} from "./IAttributes";

import { BrowserDriver } from "@/drivers/BrowserDriver";

type TConstructor = {
   name: string;
}

export class Attributes implements IAttributes {
   // vars
   public readonly name: string;
   // Observe!! Object types like this should be in Partial<> to signal that keys may not exist.
   private attributes: TAttributes;

   public constructor({ name }: TConstructor) {
      this.name = name;
      this.attributes = {
         gameObjects: {}
      };
   }

   public Init = async () => {
      // NOOP
   };

   public destroy = () => {
      // NOOP
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

   public setAttribute = ({ gameObjectId, attribute, value }: TSetAttrParams) => {
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

   public getAttribute = (params: TGameObjectIdAndAttrParams): TAttrValue => {
      return this.getAndAssertAttribute(params);
   };

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

