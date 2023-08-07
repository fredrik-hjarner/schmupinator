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
         console.warn(msg);
      }
      // guaranteed to exist since previous if case.
      return value!;
   };

   public setAttribute = ({ gameObjectId, attribute, value }: TSetAttrParams) => {
      const attrs = this.attributes.gameObjects[gameObjectId];
      if (attrs !== undefined) {
         attrs[attribute] = value;
         return;
      }
      // init if it did not exist.
      // TODO: This only needs to be done once when the enmey is created maybe.
      this.attributes.gameObjects[gameObjectId] = {
         [attribute]: value
      };
   };

   public getAttribute = (params: TGameObjectIdAndAttrParams): TAttrValue => {
      return this.getAndAssertAttribute(params);
   };

   public getNumber = ({ gameObjectId, attribute }: TGameObjectIdAndAttrParams): number => {
      const value = this.attributes.gameObjects[gameObjectId]?.[attribute];
      if(typeof value !== "number"){
         const msg = `Attributes.getNumber: "${attribute}" expected to be number but is ${value}.`;
         console.error(msg);
      }
      // guaranteed to exist since previous if case.
      return value as number; // TODO: Fix.
   };
   public getString = ({ gameObjectId, attribute }: TGameObjectIdAndAttrParams): string => {
      const value = this.attributes.gameObjects[gameObjectId]?.[attribute];
      if(typeof value !== "string"){
         const msg = `Attributes.getString: "${attribute}" expected to be string but is ${value}.`;
         console.error(msg);
      }
      // guaranteed to exist since previous if case.
      return value as string; // TODO: Fix.
   };
   public getBool = ({ gameObjectId, attribute }: TGameObjectIdAndAttrParams): boolean => {
      return !!this.attributes.gameObjects[gameObjectId]?.[attribute];
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
      (this.attributes.gameObjects[params.gameObjectId]![params.attribute] as number) +=
         params.amount;
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
      (this.attributes.gameObjects[params.gameObjectId]![params.attribute] as number) -=
         params.amount;
   };
}

