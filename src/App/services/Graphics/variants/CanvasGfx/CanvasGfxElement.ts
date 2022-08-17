import type { TShape } from "../../IGraphics";

import { BrowserDriver } from "../../../../../drivers/BrowserDriver";
// resources
import circle from "../../../../../assets/images/circle.png";
import square from "../../../../../assets/images/square.png";
import triangle from "../../../../../assets/images/triangle.png";
import diamondShield from "../../../../../assets/images/diamondShield.png";
import octagon from "../../../../../assets/images/octagon.png";
import explosion from "../../../../../assets/images/explosion.png";
import roundExplosion from "../../../../../assets/images/roundExplosion.png";

// TODO: Fix eslint problem with Image being undefined.
// TODO: Init images better.
const images = BrowserDriver.WithWindow(() => {
   /* eslint-disable no-undef */
   const imgs = {
      circle: new Image(),
      square: new Image(),
      triangle: new Image(),
      diamondShield: new Image(),
      octagon: new Image(),
      explosion: new Image(),
      roundExplosion: new Image(),
   };
   /* eslint-enable no-undef */

   imgs.circle.src = circle;
   imgs.square.src = square;
   imgs.triangle.src = triangle;
   imgs.diamondShield.src = diamondShield;
   imgs.octagon.src = octagon;
   imgs.explosion.src = explosion;
   imgs.roundExplosion.src = roundExplosion;
   
   return imgs;
});

type TVars = {
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

export class CanvasGfxElement {
   // vars
   // These values will be overwitten in this.reset anyway
   private vars: TVars = {
      x: 100, // Not sure what a reasonable default value is.
      y: 100, // Not sure what a reasonable default value is.
      scale: 1, // TODO: This seems to be unused. Unclear purpose.
      rotation: 0, // degrees
      shape: "circle" as TShape, // TODO: "none" seems like a more reasonable default??
      color: "red",
      diameter: 5,
   };
   private context?: CanvasRenderingContext2D;
   /**
    * Actions can request this object to change. These changes are are accumulated in vars.
    * In this.render the a rendering is "derived" from the vars.
    * This counter track if the gfxElement has changed since last the render.
    * If the gfxElemet has not changed then caching may be possible.
    */
   // @ts-ignore: It is unused but I will (hopefully) use it.
   private unrenderedChanges = 1;

   public constructor(canvasContext?: CanvasRenderingContext2D) {
      this.context = canvasContext;
   }

   private get radius(): number {
      return Math.round(this.vars.diameter/2);
   }

   public setVar = ({ var: key, value }: TChangeVarParams) => {
      if(this.vars[key] === value) {
         // console.log(
         //    `CanvasGfxElement: Tried to set ${key} to ${value} when it was already ${value}`
         // );
         return;
      }
      // register change!
      this.unrenderedChanges++;
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

   private deriveFilterFromColor = () => {
      switch(this.vars.color) {
         case "red":
            return "none";
         case "black":
            return "brightness(0)";
         case "green":
            return "hue-rotate(135deg) brightness(1.09)";
         case "aqua":
            return "hue-rotate(180deg) brightness(3)";
         default:
            throw new Error(`Graphics.actionSetColor: unknown color '${this.vars.color}'`);
      }
   };

   // Util to help with image, mostly because canvas rotation is awkward.
   private drawImage = (img: CanvasImageSource) => {
      const ctx = this.context;
      if(ctx === undefined) {
         return;
      }
      const radius = this.radius;
      const { rotation, diameter } = this.vars;
      const x = Math.round(this.vars.x);
      const y = Math.round(this.vars.y);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.filter = this.deriveFilterFromColor();

      ctx.drawImage(img, -radius, -radius, diameter, diameter);
      
      ctx.filter = "none";
      ctx.restore();
   };

   /**
    * Other actions accumulate changes. It is here where the rendering happens.
    * Read the state and render.
    */
   public render = () => {
      if(this.context === undefined) {
         return;
      }
      // if(this.unrenderedChanges === 0) {
      //    return;
      // }

      const { shape } = this.vars;

      switch(shape) {
         case "none":
            break;
         case "circle":
         case "square":
         case "triangle":
         case "diamondShield":
         case "octagon":
            images && this.drawImage(images[shape]);
            break;
         case "explosion":
         case "roundExplosion":
            images && this.drawImage(images[shape]);
            break;
         default:
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error(`CanvasGfxElement: unhandles shape '${shape}'`);
      }

      // console.log(this.unrenderedChanges);

      // all changes were rendered!
      this.unrenderedChanges = 0;
   };
}