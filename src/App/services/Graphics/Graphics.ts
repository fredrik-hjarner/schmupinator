import type {
   IGraphics, TGfx_Release, TGfx_SetColor, TGfx_SetDiameter, TGfx_SetPosition, TGfx_SetRotation,
   TGfx_SetScale, TGfx_SetShape, TGraphicsAction, TGraphicsResponse, THandle,
   TResponse_AskForElement, TResponse_Void, TShape
} from "./IGraphics";

import { resolutionWidth, zIndices } from "../../../consts";
import { px } from "../../../utils/px";
import { guid } from "../../../utils/uuid";
import { Vector as TVector } from "../../../math/bezier";
import { BrowserDriver } from "../../../drivers/BrowserDriver";

type TGraphicsElement = {
   handle: string; // Unique identifier used as handle for this specifc GraphicsElement.
   inUse: boolean // If the GraphicsElement is in use, or if it is free to give away.
   element: HTMLDivElement;
   scale: number;
   rotation: number; // degrees
   index: number;
   shape: TShape;
   diameter: number;
}

type TConstructor = { name: string };

export class Graphics implements IGraphics {
   public name: string;
   private elementPool: TGraphicsElement[];
   private static poolSize = 100;

   public constructor({ name }: TConstructor) {
      this.name = name;
      this.elementPool = this.initElementPool();
   }

   public Init = async () => {
      // noop
   };

   public Dispatch = (action: TGraphicsAction): TGraphicsResponse => {
      switch(action.type) {
         case "gfxAskForElement":
            return this.actionAskForElement();
         case "gfxSetPosition":
            return this.actionSetPosition(action);
         case "gfxSetDiameter":
            return this.actionSetDiameter(action);
         case "gfxRelease":
            return this.actionRelease(action);
         case "gfxSetColor":
            return this.actionSetColor(action);
         case "gfxSetShape":
            return this.actionSetShape(action);
         case "gfxSetRotation":
            return this.actionSetRotation(action);
         case "gfxSetScale":
            return this.actionSetScale(action);
         default: {
            // eslint-disable-next-line
            // @ts-ignore
            const errMsg = `unknown action type: ${action.type}`; // eslint-disable-line
            BrowserDriver.Alert(errMsg); 
            throw new Error(errMsg);
         }
      }
   };

   private getRestingPlace = (i: number): TVector => {
      const column = Math.floor(i /10);
      const row = i % 10;
      const x = 20 + resolutionWidth + 10 * column;
      const y = 20 + 0 + 10 * row;
      return { x, y };
   };

   private initElementPool = (): TGraphicsElement[] => {
      return Array(Graphics.poolSize).fill(0).map((_, i) =>
         this.initOneElement(i)
      );
   };

   private reset = (ge: TGraphicsElement) => {
      const { x, y } = this.getRestingPlace(ge.index);
      const color = "orange";
      const diameter = 5;
      const radius = diameter/2;

      const top = y - radius;
      const left = x - radius;
   
      ge.rotation = 0;
      ge.scale = 1;
      /** TODO: Remove duplication */
      ge.element.style.position = "fixed";
      ge.element.style.boxSizing = "border-box";
      ge.element.style.backgroundColor = color;
      ge.element.style.width = px(diameter);
      ge.element.style.height = px(diameter);
      ge.element.style.top = px(top);
      ge.element.style.left = px(left);
      ge.element.style.zIndex = zIndices.graphicsEngineElements;
      ge.element.style.transform = `rotate(0deg) scale(1)`;
   };

   private initOneElement = (i: number): TGraphicsElement => {
      const { x, y } = this.getRestingPlace(i);
      const color = "orange";
      const diameter = 5;
      const radius = diameter/2;

      const handle = `${guid()}`;
      const top = y - radius;
      const left = x - radius;
   
      /** TODO: Remove duplication */
      const element = BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("div");
         element.id = handle;
         element.style.position = "fixed";
         element.style.boxSizing = "border-box";
         element.style.backgroundColor = color;
         element.style.width = px(diameter);
         element.style.height = px(diameter);
         element.style.top = px(top);
         element.style.left = px(left);
         element.style.zIndex = zIndices.graphicsEngineElements;
         element.style.transform = `rotate(0deg) scale(1)`;
         window.document.body.appendChild(element);
         return element;
      }) as HTMLDivElement;

      return {
         handle,
         inUse: false,
         element,
         index: i,
         shape: "circle",
         diameter: 5,
         scale: 1,
         rotation: 0
      };
   };

   // Helper that finds and assert that an element exists and is in use.
   private findExistingAndInUse = (handle: THandle): TGraphicsElement => {
      const element = this.elementPool.find(element => element.handle === handle);
      if(!element) {
         BrowserDriver.Alert(`Graphics: No GraphicsElement with handle "${handle}"!`);
         throw new Error(`Graphics: No GraphicsElement with handle "${handle}"!`);
      }
      if(!element.inUse) {
         BrowserDriver.Alert(`Graphics: Trying to set position for unused handle "${handle}"!`);
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
      BrowserDriver.Alert("Graphics: All elements are in use!");
      throw new Error("Graphics: All elements are in use!");
   };

   private actionSetPosition =
      ({ handle, x, y }: Omit<TGfx_SetPosition,"type">): TResponse_Void => {
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
      ({ handle, diameter }: Omit<TGfx_SetDiameter,"type">): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);
         const oldRadius = element.diameter/2;
         const radius = diameter/2;
         const delta = radius - oldRadius;
         const style = element.element.style;
         style.width = px(diameter);
         style.height = px(diameter);
         style.left = px(parseFloat(style.left) - delta);
         style.top = px(parseFloat(style.top) - delta);

         element.diameter = diameter;
         return { type: "responseVoid" };
      };

   private actionRelease =
      ({ handle }: Omit<TGfx_Release,"type">): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);

         // Put back in resting position and reset styles.
         this.reset(element);
         
         element.inUse = false;
         return { type: "responseVoid" };
      };
   
   private actionSetColor =
      ({ handle, color }: Omit<TGfx_SetColor,"type">): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);
         element.element.style.backgroundColor = color;
         return { type: "responseVoid" };
      };

   private actionSetShape =
      ({ handle, shape }: Omit<TGfx_SetShape,"type">): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);
         switch(shape) {
            case "circle": {
               element.element.style.clipPath = "circle(50%)";
               break;
            }
            case "square": {
               element.element.style.clipPath = "none";
               break;
            }
            case "triangle": {
               element.element.style.clipPath = "polygon(50% 0%, 100% 100%, 0% 100%)";
               break;
            }
            case "diamondShield":
               element.element.style.clipPath =
                  "polygon(50% 0%,100.00% 80.00%,50% 100%,0.00% 80.00%)";
               break;
            case "octagon":
               element.element.style.clipPath =
                  "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)";
               break;
         }
         element.shape = shape;
         return { type: "responseVoid" };
      };

   private actionSetRotation =
      ({ handle, degrees }: Omit<TGfx_SetRotation,"type">): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);
         element.rotation = degrees;
         element.element.style.transform =
            `rotate(${element.rotation}deg) scale(${element.scale})`;
         return { type: "responseVoid" };
      };

   private actionSetScale =
      ({ handle, scale }: Omit<TGfx_SetScale,"type">): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);
         element.scale = scale;
         element.element.style.transform =
            `rotate(${element.rotation}deg) scale(${element.scale})`;
         return { type: "responseVoid" };
      };
}
