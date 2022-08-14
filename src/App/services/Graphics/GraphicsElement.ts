import type { TShape } from "./IGraphics";

import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { px } from "../../../utils/px";
import { zIndices } from "../../../consts";
// resources
import circle from "../../../assets/images/circle.png";
import square from "../../../assets/images/square.png";
import triangle from "../../../assets/images/triangle.png";
import diamondShield from "../../../assets/images/diamondShield.png";
import octagon from "../../../assets/images/octagon.png";
import explosion from "../../../assets/images/explosion.png";
import roundExplosion from "../../../assets/images/roundExplosion.png";

/**
 * TODO:
 * radius could be a private field that is getting updated whenever diameter is updated.
 */

export class GraphicsElement {
   // vars
   // These values will be overwitten in this.reset anyway
   private vars = {
      x: 100, // Not sure what a reasonable default value is.
      y: 100, // Not sure what a reasonable default value is.
      scale: 1,
      rotation: 0, // degrees
      shape: "circle" as TShape, // TODO: "none" seems like a more reasonable default??
      color: "red",
      diameter: 5,
   };

   // elements
   // TODO: Not sure if this should be nullable. Nullable needs if case everywhere. Prolly remove ?
   private element?: HTMLDivElement;

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   private logError = (...params: any[]) => {
      console.error(
         "GraphicsElement:",
         ...params // eslint-disable-line @typescript-eslint/no-unsafe-argument
      );
   };

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   private logWarn = (..._params: any[]) => {
      // uncommented not to spam warnings.
      // console.warn(
      //    "GraphicsElement:",
      //    ...params // eslint-disable-line @typescript-eslint/no-unsafe-argument
      // );
   };

   /**
    * 
    * @param x restingPlace x TODO: remove this param. will be necessary when I have this.commit.
    * @param y restingPlace y TODO: remove this param. will be necessary when I have this.commit.
    */
   public constructor(x: number, y: number) {
      this.element = BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("div");

         this.applyUnchangingDefaults(element);
         this.resetElement(x, y, element);

         window.document.body.appendChild(element);
         return element;
      });
   }

   // These styles values never change, are always the same.
   private applyUnchangingDefaults(element: HTMLDivElement){
      /**
       * These could actually be applied via a style tag, and I think that is better,
       * so that they are separated more from the styles that CAN change.
       */
      element.style.position = "fixed";
      element.style.boxSizing = "border-box";
      element.style.backgroundSize = "contain";
      element.style.imageRendering = "pixelated";
      element.style.backgroundRepeat = "no-repeat";
      element.style.backgroundPosition = "center";
      element.style.zIndex = zIndices.graphicsEngineElements;
   }

   /**
    * 
    * @param x restingPlace x TODO: remove this param. will be necessary when I have this.commit.
    * @param y restingPlace y TODO: remove this param. will be necessary when I have this.commit.
    */
   public reset = (x: number, y: number) => {
      if(this.element === undefined) {
         this.logError("Tried to reset an undefined element");
         return;
      }
      this.resetElement(x, y, this.element);
   };

   /**
    * 
    * @param x restingPlace x TODO: remove this param. will be necessary when I have this.commit.
    * @param y restingPlace y TODO: remove this param. will be necessary when I have this.commit.
    */
   private resetElement = (x: number, y: number, element: HTMLDivElement) => {
      this.vars = {
         color: "red",
         diameter: 5,
         rotation: 0,
         scale: 1,
         shape: "circle",
         x,
         y,
      };

      const radius = this.vars.diameter/2;

      const top = y - radius;
      const left = x - radius;

      /**
       * TODO: These could all be derived from values in this.vars,
       * I should do that in a this.commit method!
       */
      element.style.backgroundImage = `url('${circle}')`;
      element.style.filter = "none";
      element.style.width = px(this.vars.diameter);
      element.style.height = px(this.vars.diameter);
      element.style.top = px(top);
      element.style.left = px(left);
      element.style.transform = `rotate(0deg) scale(1)`;
   };

   public setX = (x: number) => {
      if(this.element === undefined) {
         this.logError("Tried to setX of undefined element");
         return;
      }
      if(this.vars.x === x) {
         this.logWarn(`Tried to setX to ${x} when it was already ${x}`);
         return;
      }
      
      const radius = this.vars.diameter/2;
      this.vars.x = x;
      this.element.style.left = px(x - radius);
   };

   public setY = (y: number) => {
      if(this.element === undefined) {
         this.logError("Tried to setY of undefined element");
         return;
      }
      if(this.vars.y === y) {
         this.logWarn(`Tried to setY to ${y} when it was already ${y}`);
         return;
      }
      
      const radius = this.vars.diameter/2;
      this.vars.y = y;
      this.element.style.top = px(y - radius);
   };

   public setDiameter = (diameter: number) => {
      if(this.element === undefined) {
         this.logError("Tried to setDiameter of undefined element");
         return;
      }
      if(this.vars.diameter === diameter) {
         this.logWarn(`Tried to setDiameter to ${diameter} when it was already ${diameter}`);
         return;
      }
      this.vars.diameter = diameter;

      const oldRadius = this.vars.diameter/2;
      const radius = diameter/2;
      const delta = radius - oldRadius;
      const style = this.element.style;
      style.width = px(diameter);
      style.height = px(diameter);
      style.left = px(parseFloat(style.left) - delta);
      style.top = px(parseFloat(style.top) - delta);
   };

   public setColor = (color: string) => {
      if(this.element === undefined) {
         this.logError("Tried to setColor of undefined element");
         return;
      }
      if(this.vars.color === color) {
         this.logWarn(`Tried to setColor to ${color} when it was already ${color}`);
         return;
      }
      this.vars.color = color;
      /**
       * TODO: This switch case is ugly, should do this in some other way??
       */
      switch(color) {
         case "red":
            this.element.style.filter = "none";
            break;
         case "black":
            this.element.style.filter = "brightness(0)";
            break;
         case "green":
            this.element.style.filter = "hue-rotate(135deg) brightness(1.09)";
            break;
         case "aqua":
            this.element.style.filter = "hue-rotate(180deg) brightness(3)";
            break;
         default:
            BrowserDriver.Alert(`Graphics.actionSetColor: unknown color '${color}'`);
            break;
      }
   };

   public setShape = (shape: TShape) => {
      if(this.element === undefined) {
         this.logError("Tried to setShape of undefined element");
         return;
      }
      if(this.vars.shape === shape) {
         this.logWarn(`Tried to setShape to ${shape} when it was already ${shape}`);
         return;
      }
      this.vars.shape = shape;

      switch(shape) {
         case "none": {
            this.element.style.backgroundImage = "none";
            break;
         }
         case "circle": {
            this.element.style.backgroundImage = `url('${circle}')`;
            break;
         }
         case "square": {
            this.element.style.backgroundImage = `url('${square}')`;
            break;
         }
         case "triangle": {
            this.element.style.backgroundImage = `url('${triangle}')`;
            break;
         }
         case "diamondShield":
            this.element.style.backgroundImage = `url('${diamondShield}')`;
            break;
         case "octagon":
            this.element.style.backgroundImage = `url('${octagon}')`;
            break;
         case "explosion": {
            /**
             * Without the query string, all animations of same file were synced like it was
             * only one animation displayed on different places. Also the querystring must
             * be different EVERY time so that's why I use `Date.now()`.
             */
            const q = `?id=${Date.now()}`;
            this.element.style.backgroundImage = `url('${explosion}${q}')`;
            break;
         }
         case "roundExplosion": {
            const q = `?id=${Date.now()}`;
            this.element.style.backgroundImage = `url('${roundExplosion}${q}')`;
            break;
         }
      }
   };

   public setRotation = (rotation: number) => {
      if(this.element === undefined) {
         this.logError("Tried to setRotation of undefined element");
         return;
      }
      if(this.vars.rotation === rotation) {
         this.logWarn(`Tried to setRotation to ${rotation} when it was already ${rotation}`);
         return;
      }
      this.vars.rotation = rotation;

      this.element.style.transform = `rotate(${this.vars.rotation}deg) scale(${this.vars.scale})`;
   };

   public setScale = (scale: number) => {
      if(this.element === undefined) {
         this.logError("Tried to setScale of undefined element");
         return;
      }
      if(this.vars.scale === scale) {
         this.logWarn(`Tried to setScale to ${scale} when it was already ${scale}`);
         return;
      }
      this.vars.scale = scale;

      this.element.style.transform = `rotate(${this.vars.rotation}deg) scale(${this.vars.scale})`;
   };
}