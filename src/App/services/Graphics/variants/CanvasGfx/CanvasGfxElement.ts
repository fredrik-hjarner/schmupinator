import type { TShape } from "../../IGraphics";
import type { Renderer } from "./Renderer";

export type TGfxElementVars = {
   x: number;
   y: number;
   scale: number; // TODO: This seems to be unused. Unclear purpose.
   rotation: number; // degrees
   shape: TShape;
   color: string;
   diameter: number;
}

type TChangeVarParams =
   { var: "x", value: number } |
   { var: "y", value: number } |
   { var: "scale", value: number } |
   { var: "rotation", value: number } |
   { var: "shape", value: TShape } |
   { var: "color", value: string } |
   { var: "diameter", value: number };

type TConstrutor = {
   ctx?: CanvasRenderingContext2D;
   renderer: Renderer;
}

export class CanvasGfxElement {
   // vars
   // These values will be overwitten in this.reset anyway
   private vars: TGfxElementVars = {
      x: 100, // Not sure what a reasonable default value is.
      y: 100, // Not sure what a reasonable default value is.
      scale: 1, // TODO: This seems to be unused. Unclear purpose.
      rotation: 0, // degrees
      shape: "circle" as TShape, // TODO: "none" seems like a more reasonable default??
      color: "red",
      diameter: 5,
   };
   private context?: CanvasRenderingContext2D;

   // deps/services
   private renderer: Renderer;

   public constructor(params: TConstrutor) {
      this.context = params.ctx;
      this.renderer = params.renderer;
   }

   public setVar = ({ var: key, value }: TChangeVarParams) => {
      if(this.vars[key] === value) {
         // console.log(
         //    `CanvasGfxElement: Tried to set ${key} to ${value} when it was already ${value}`
         // );
         return;
      }
      switch(key) { // this switch case is unncessary but Typescript is not smart enough.
         case "color":
            this.vars[key] = value;
            break;
         case "diameter":
            this.vars[key] = value;
            break;
         case "rotation":
            this.vars[key] = value;
            break;
         case "scale":
            this.vars[key] = value;
            break;
         case "shape":
            this.vars[key] = value;
            break;
         case "x":
            this.vars[key] = value;
            break;
         case "y":
            this.vars[key] = value;
            break;
         default:
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error(`CanvasGfxElement: Tried to set unknown var ${key}.`);
      }
   };

   /**
    * TODO: Update comment.
    * Other actions accumulate changes. It is here where the rendering happens.
    * Read the state and render.
    */
   public render = () => {
      if(this.context === undefined) { return; }

      this.renderer.render({ ctx: this.context, gfxElement: this.vars });
   };
}