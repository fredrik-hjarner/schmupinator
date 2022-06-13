import type { App } from "../../App";

import type { IService } from "../IService";

import { resolutionWidth, zIndices } from "../../../consts";
import { px } from "../../../utils/px";
import { uuid } from "../../../utils/uuid";
import { Vector as TVector } from "../../../math/bezier";

export type THandle = string;

/***********
 * Actions *
 ***********/
// Asks the Graphics Engine for a graphics element if you want one.
type TAction_AskForElement = { type: "actionAskForElement" };
type TAction_SetPosition = {
   type: "actionSetPosition",
   payload: { handle: THandle, x?: number, y?: number }
};
type TAction_SetDiameter = {
   type: "actionSetDiameter",
   payload: { handle: THandle, diameter: number }
};
type TAction_SetHealth = { type: "actionSetHealth", payload: {
   handle: THandle,
   healthFactor: number // 0 = no health, 1 = full health
}};
// Releases a GraphicsElement, so it's free for other to pick up/ask for/claim.
type TAction_Release = { type: "actionRelease", payload: { handle: THandle }};

type TGraphicsAction =
   TAction_AskForElement | TAction_SetPosition | TAction_SetDiameter | TAction_SetHealth |
   TAction_Release;

/*************
 * Responses *
 *************/
// Returns a handle to the element.
export type TResponse_AskForElement = {
   type: "responseAskForElement", handle: THandle,
}
export type TResponse_Void = { type: "responseVoid" };

type TGraphicsResponse = TResponse_AskForElement | TResponse_Void;

type TGraphicsElement = {
   handle: string; // Unique identifier used as handle for this specifc GraphicsElement.
   inUse: boolean // If the GraphicsElement is in use, or if it is free to give away.
   element: HTMLDivElement;
}

type TConstructor = { app: App; name: string };

export class Graphics implements IService {
   public app: App;
   public name: string;
   private elementPool: TGraphicsElement[];
   private static poolSize = 100;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.elementPool = this.initElementPool();
   }

   public Dispatch = (action: TGraphicsAction): TGraphicsResponse => {
      switch(action.type) {
         case "actionAskForElement": {
            return this.actionAskForElement();
         }
         case "actionSetPosition": {
            return this.actionSetPosition(action.payload);
         }
         case "actionSetDiameter": {
            return this.actionSetDiameter(action.payload);
         }
         case "actionSetHealth": {
            return this.actionSetHealth(action.payload);
         }
         case "actionRelease": {
            return this.actionRelease(action.payload);
         }
      }
   };

   private getRestingPlace = (i: number): TVector => {
      // const i = this.elementPool.findIndex(e => e.handle === element.handle);
      const column = Math.floor(i /10);
      const row = i % 10;
      const x = 20 + resolutionWidth + 10 * column;
      const y = 20 + 0 + 10 * row;
      return { x, y };
   };

   private initElementPool = (): TGraphicsElement[] => {
      return Array(Graphics.poolSize).fill(0).map((_, i) =>
         this.initOneElement(this.getRestingPlace(i))
      );
   };

   private initOneElement = ( {x, y }: { x: number, y: number }): TGraphicsElement => {
      const color = "orange";
      const diameter = 5;
      const radius = diameter/2;

      const handle = `${uuid()}`;
      const top = y - radius;
      const left = x - radius;
   
      const element = document.createElement("div");
      element.id = handle;
      element.style.position = "fixed";
      element.style.boxSizing = "border-box";
      element.style.borderColor = color;
      element.style.borderStyle = "solid";
      element.style.borderWidth = px(radius); // filled
      element.style.width = px(diameter);
      element.style.height = px(diameter);
      element.style.top = px(top);
      element.style.left = px(left);
      element.style.borderRadius = px(5000);
      element.style.zIndex = zIndices.graphicsEngineElements;
      document.body.appendChild(element);

      return { handle, inUse: false, element };
   };

   // Helper that finds and assert that an element exists and is in use.
   private findExistingAndInUse = (handle: THandle): TGraphicsElement => {
      const element = this.elementPool.find(element => element.handle === handle);
      if(!element) {
         throw new Error(`Graphics: No GraphicsElement with handle "${handle}"!`);
      }
      if(!element.inUse) {
         throw new Error(`Graphics: Trying to set position for unused handle "${handle}"!`);
      }
      return element;
   };

   private actionAskForElement = (): TResponse_AskForElement => {
      const unusedElement = this.elementPool.find(element => !element.inUse);
      if(unusedElement) {
         unusedElement.inUse = true;
         return { type: "responseAskForElement", handle: unusedElement.handle };
      }
      throw new Error("Graphics: All elements are in use!");
   };

   private actionSetPosition =
      ({ handle, x, y }: TAction_SetPosition["payload"]): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);
         const diameter = parseFloat(element.element.style.width);
         const radius = diameter/2;
         if(x !== undefined) {
            element.element.style.left = px(x - radius);
         }
         if(y !== undefined) {
            element.element.style.top = px(y - radius);
         }
         return { type: "responseVoid" };
      };

   private actionSetDiameter =
      ({ handle, diameter }: TAction_SetDiameter["payload"]): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);
         const oldRadius = parseFloat(element.element.style.width)/2;
         const radius = diameter/2;
         const delta = radius - oldRadius;
         const style = element.element.style;
         style.width = px(diameter);
         style.height = px(diameter);
         style.left = px(parseFloat(style.left) - delta);
         style.top = px(parseFloat(style.top) - delta);
         return { type: "responseVoid" };
      };

   private actionSetHealth =
      ({ handle, healthFactor }: TAction_SetHealth["payload"]): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);
         const radius = parseFloat(element.element.style.width)/2;
         element.element.style.borderWidth = px(radius * healthFactor);
         return { type: "responseVoid" };
      };

   private actionRelease =
      ({ handle }: TAction_Release["payload"]): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);

         // Put back in resting position!
         const i = this.elementPool.findIndex(e => e.handle === element.handle);
         const restingPlace = this.getRestingPlace(i);
         element.element.style.left = px(restingPlace.x);
         element.element.style.top = px(restingPlace.y);
         
         element.inUse = false;
         return { type: "responseVoid" };
      };
}
