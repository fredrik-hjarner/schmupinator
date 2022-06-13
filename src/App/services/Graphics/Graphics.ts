import type { App } from "../../App";

import type { IService } from "../IService";

import { resolutionWidth } from "../../../consts";
import { px } from "../../../utils/px";
import { uuid } from "../../../utils/uuid";

type THandle = string;

/***********
 * Actions *
 ***********/
// Asks the Graphics Engine for a graphics element if you want one.
type TAction_AskForElement = { type: "actionAskForElement" };
type TAction_SetPosition = {
   type: "actionSetPosition",
   payload: { handle: THandle, x?: number, y?: number }
};

type TGraphicsAction = TAction_AskForElement | TAction_SetPosition;

/*************
 * Responses *
 *************/
// Returns a handle to the element.
type TResponse_AskForElement = {
   type: "responseAskForElement",
   payload: { handle: THandle, error?: string }
}
type TResponse_MaybeError = { type: "responseMaybeError", error?: string };

type TGraphicsResponse = TResponse_AskForElement | TResponse_MaybeError;

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
   private static poolSize = 40;

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
      }
   };

   private initElementPool = (): TGraphicsElement[] => {
      const poolIndex = 0;
      return Array(Graphics.poolSize).fill(0).map((_, i) =>
         this.initOneElement({
            x: resolutionWidth + 10 + 3 + poolIndex*15,
            y: 10 + 3 + i*6,
         })
      );
   };

   private initOneElement = ( {x, y }: { x: number, y: number }): TGraphicsElement => {
      const color = "red";
      const diameter = 10;
      const radius = diameter/2;

      const handle = `${uuid()}`;
      const top = x - radius;
      const left = y - radius;
   
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
      element.style.borderRadius = px(diameter);
      document.body.appendChild(element);

      return { handle, inUse: false, element };
   };

   private actionAskForElement = (): TResponse_AskForElement => {
      const unusedElement = this.elementPool.find(element => !element.inUse);
      if(unusedElement) {
         return { type: "responseAskForElement", payload: { handle: unusedElement.handle} };
      }
      console.error("Graphics: All elements are in use!");
      return { type: "responseAskForElement", payload: { handle: "", error: "no free elements" } };
   };

   private actionSetPosition =
      ({ handle, x, y }: TAction_SetPosition["payload"]): TResponse_MaybeError => {
         const element = this.elementPool.find(element => element.handle);
         if(!element) {
            console.error(`Graphics: No GraphicsElement with handle "${handle}"!`);
            return { type: "responseMaybeError", error: `handle "${handle}" not found` };
         }
         const diameter = parseFloat(element.element.style.width);
         const radius = diameter/2;
         if(x !== undefined) {
            element.element.style.left = px(x - radius);
         }
         if(y !== undefined) {
            element.element.style.top = px(y - radius);
         }
         return { type: "responseMaybeError" };
      };
}
