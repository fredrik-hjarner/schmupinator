import type {
   IGraphics, TGfx_Release, TGfx_SetColor, TGfx_SetDiameter, TGfx_SetPosition, TGfx_SetRotation,
   TGfx_SetScale, TGfx_SetShape, TGraphicsAction, TGraphicsResponse, THandle,
   TResponse_AskForElement, TResponse_Void
} from "../../IGraphics";
import type { TInitParams } from "../../../IService";
import type { IEventsEndOfFrame } from "../../../Events/IEvents";

import { resolutionHeight, resolutionWidth, zIndices } from "../../../../../consts";
import { guid } from "../../../../../utils/uuid";
import { BrowserDriver } from "../../../../../drivers/BrowserDriver";
import { CanvasGfxElement } from "./CanvasGfxElement";
import { px } from "../../../../../utils/px";

type TGfxPoolEntry = {
   handle: string; // Unique identifier used as handle for this specifc GraphicsElement.
   element: CanvasGfxElement;
}

type TGfxPool = Partial<{ [handle: string]: TGfxPoolEntry }>;

type TConstructor = { name: string };

export class CanvasGfx implements IGraphics /*, IDestroyable*/ {
   // vars
   public name: string;
   private gfxElements: TGfxPool = {};
   private canvasContext?: CanvasRenderingContext2D;

   // deps/services
   private eventsEndOfFrame!: IEventsEndOfFrame;

   public constructor({ name }: TConstructor) {
      this.name = name;
      const maybeContext = BrowserDriver.WithWindow(window => {
         const canvas = window.document.createElement("canvas");
         canvas.width = resolutionWidth;
         canvas.height = resolutionHeight;
         canvas.style.position = "fixed";
         canvas.style.top = px(0);
         canvas.style.left = px(0);
         canvas.style.zIndex = zIndices.graphicsEngineElements;
         canvas.style.imageRendering = "pixelated";
   
         window.document.body.appendChild(canvas);
   
         return canvas.getContext("2d");
      });
      if(maybeContext !== null && maybeContext !== undefined){
         this.canvasContext = maybeContext;
      }
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      this.eventsEndOfFrame = deps?.eventsEndOfFrame as IEventsEndOfFrame;
      // TODO: Remember to unsubscribe.
      this.eventsEndOfFrame.subscribeToEvent(this.name, this.render);
   };

   private render = () => {
      // clear canvas.
      if(this.canvasContext !== undefined) {
         this.canvasContext.clearRect(0, 0, resolutionWidth, resolutionHeight);
      }
      // render/commit all gfxElements.
      Object.values(this.gfxElements).forEach(gfx => {
         if(gfx === undefined) {
            throw new Error("CanvasGfx: gfx is undefined");
         }
         gfx.element.render();
      });
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

   // Helper that finds and assert that an element exists and is in use.
   private findExistingAndInUse = (handle: THandle): TGfxPoolEntry => {
      const element = this.gfxElements[handle];
      if(!element) {
         BrowserDriver.Alert(`Graphics: No GraphicsElement with handle "${handle}"!`);
         throw new Error(`Graphics: No GraphicsElement with handle "${handle}"!`);
      }
      return element;
   };

   private actionAskForElement = (): TResponse_AskForElement => {
      const handle = `${guid()}`;
      this.gfxElements[handle] = {
         handle,
         element: new CanvasGfxElement(this.canvasContext)
      };
      return { type: "responseAskForElement", handle };
   };

   private actionSetPosition =
      ({ handle, x, y }: Omit<TGfx_SetPosition,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         if(x !== undefined) {
            gfxEntry.element.setVar({ var: "x", value: x });
         }
         if(y !== undefined) {
            gfxEntry.element.setVar({ var: "y", value: y });
         }
         return { type: "responseVoid" };
      };

   private actionSetDiameter =
      ({ handle, diameter }: Omit<TGfx_SetDiameter,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.setVar({var: "diameter", value: diameter});
         return { type: "responseVoid" };
      };

   private actionRelease =
      ({ handle }: Omit<TGfx_Release,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         // Delete the CanvasGfxElement
         delete this.gfxElements[gfxEntry.handle];
         return { type: "responseVoid" };
      };
   
   private actionSetColor =
      ({ handle, color }: Omit<TGfx_SetColor,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.setVar({ var : "color", value:color });
         return { type: "responseVoid" };
      };

   private actionSetShape =
      ({ handle, shape }: Omit<TGfx_SetShape,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.setVar({ var: "shape", value: shape });
         return { type: "responseVoid" };
      };

   private actionSetRotation =
      ({ handle, degrees }: Omit<TGfx_SetRotation,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.setVar({ var: "rotation", value: degrees });
         return { type: "responseVoid" };
      };

   private actionSetScale =
      ({ handle, scale }: Omit<TGfx_SetScale,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.setVar({ var: "scale", value: scale });
         return { type: "responseVoid" };
      };
}