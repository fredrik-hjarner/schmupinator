import type {
   IGraphics, TGfx_Release, TGfx_SetColor, TGfx_SetDiameter, TGfx_SetPosition, TGfx_SetRotation,
   TGfx_SetScale, TGfx_SetShape, TGraphicsAction, TGraphicsResponse, THandle,
   TResponse_AskForElement, TResponse_Void
} from "../../IGraphics";
import type { TInitParams } from "../../../IService";
import type { IEventsEndOfFrame } from "../../../Events/IEvents";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import { Renderer } from "./Renderer";
import { resolutionHeight, resolutionWidth, zIndices } from "../../../../../consts";
import { uuid } from "../../../../../utils/uuid";
import { BrowserDriver } from "../../../../../drivers/BrowserDriver";
import { GfxElementData } from "./GfxElementData";
import { px } from "../../../../../utils/px";

type TGfxPoolEntry = {
   handle: string; // Unique identifier used as handle for this specifc GraphicsElement.
   element: GfxElementData;
}

type TGfxPool = Partial<{ [handle: string]: TGfxPoolEntry }>;

type TConstructor = { name: string };

export class CanvasGfx implements IGraphics {
   // vars
   public readonly name: string;
   private gfxElements: TGfxPool = {};
   private canvasContext?: CanvasRenderingContext2D;

   // deps/services
   private eventsEndOfFrame!: IEventsEndOfFrame;
   private renderer: Renderer; // TODO: Isn't exactly a service, don't know if it should be.

   public constructor({ name }: TConstructor) {
      this.name = name;
      this.renderer = new Renderer();
      this.canvasContext = BrowserDriver.WithWindow(window => {
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
      })!;
   }

   public destroy = () => {
      /**
       * Unsubscribe from events.
       */
      this.eventsEndOfFrame.unsubscribeToEvent(this.name);
      
      /**
        * reset vars
        */
      this.gfxElements = {};

      /**
        * Destroy elements
        */
      if(this.canvasContext !== undefined) {
         this.canvasContext.canvas.remove();
         this.canvasContext = undefined;
      }
      this.renderer = new Renderer();
   };

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      // TODO: Better type checking.
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      this.eventsEndOfFrame = deps?.eventsEndOfFrame!;
      // TODO: Remember to unsubscribe.
      this.eventsEndOfFrame.subscribeToEvent(this.name, this.render);
   };

   private render = () => {
      if(this.canvasContext === undefined) {
         const errMsg = "CanvasGfx.render: this.canvasContext was undefined";
         console.error(errMsg);
         throw new Error(errMsg);
      }
      // clear canvas.
      this.canvasContext.clearRect(0, 0, resolutionWidth, resolutionHeight);
      // render/commit all gfxElements.
      Object.values(this.gfxElements).forEach(gfx => {
         if(gfx === undefined) {
            throw new Error("CanvasGfx: gfx is undefined");
         }
         this.renderer.render({ ctx: this.canvasContext, data: gfx.element });
      });
   };

   public Dispatch = (action: TGraphicsAction): TGraphicsResponse => {
      switch(action.type) {
         case AT.gfxAskForElement:
            return this.actionAskForElement();
         case AT.gfxSetPosition:
            return this.actionSetPosition(action);
         case AT.gfxSetDiameter:
            return this.actionSetDiameter(action);
         case AT.gfxRelease:
            return this.actionRelease(action);
         case AT.gfxSetColor:
            return this.actionSetColor(action);
         case AT.gfxSetShape:
            return this.actionSetShape(action);
         case AT.gfxSetRotation:
            return this.actionSetRotation(action);
         case AT.gfxSetScale:
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
      const handle = `${uuid("guid")}`;
      this.gfxElements[handle] = {
         handle,
         element: new GfxElementData()
      };
      return { type: "responseAskForElement", handle };
   };

   private actionSetPosition =
      ({ handle, x, y }: Omit<TGfx_SetPosition,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         if(x !== undefined) {
            gfxEntry.element.x = x;
         }
         if(y !== undefined) {
            gfxEntry.element.y = y;
         }
         return { type: "responseVoid" };
      };

   private actionSetDiameter =
      ({ handle, diameter }: Omit<TGfx_SetDiameter,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.diameter = diameter;
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
         gfxEntry.element.color = color;
         return { type: "responseVoid" };
      };

   private actionSetShape =
      ({ handle, shape }: Omit<TGfx_SetShape,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.shape = shape;
         return { type: "responseVoid" };
      };

   private actionSetRotation =
      ({ handle, degrees }: Omit<TGfx_SetRotation,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.rotation = degrees;
         return { type: "responseVoid" };
      };

   private actionSetScale =
      ({ handle, scale }: Omit<TGfx_SetScale,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.scale = scale;
         return { type: "responseVoid" };
      };
}
