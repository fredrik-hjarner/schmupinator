import type { GfxElementData } from "./GfxElementData";

import { BrowserDriver } from "../../../../../drivers/BrowserDriver";
import { Cache } from "./Cache";
// resources
const circle = "/images/circle.png";
const square = "/images/square.png";
const triangle = "/images/triangle.png";
const diamondShield = "/images/diamondShield.png";
const octagon = "/images/octagon.png";
const explosion = "/images/explosion.png";
const roundExplosion = "/images/roundExplosion.png";

type TRenderParams = {
   ctx: CanvasRenderingContext2D;
   data: GfxElementData;
}

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

export class Renderer {
   private cache = new Cache<HTMLCanvasElement>({});

   // TODO: Actually I only support some colors so color should have a more specific type.
   private deriveFilterFromColor = (color: string) => {
      switch(color) {
         case "red":
            return "none";
         case "black":
            return "brightness(0)";
         case "green":
            return "hue-rotate(135deg) brightness(1.09)";
         case "aqua":
            return "hue-rotate(180deg) brightness(3)";
         default:
            throw new Error(`Graphics.actionSetColor: unknown color '${color}'`);
      }
   };

   // Util to help with image, mostly because canvas rotation is awkward.
   private drawImage = (img: CanvasImageSource, params: TRenderParams) => {
      const { data: gfxElement } = params;
      const { color, radius, rotation, diameter, x, y } = gfxElement;
      /**
       * If you rotate a 1x1 square 45 degrees it WON'T fit inside of a 1x1 square x-y-wize.
       * diagonals will be outside of the canvas/square.
       * Actually what I call diameter is actually the length of one side on a sqaure. 
       */
      const diameterOfCanvas = diameter*Math.SQRT2;
      const radiusOfCanvas = diameterOfCanvas/2;

      /**
       * Check cache
       */
      const key = JSON.stringify(params.data.serialized);
      const fromCache = this.cache.tryGet(key);
      if(fromCache !== undefined) {
         // console.log("found in cache:", key);
         params.ctx.drawImage(fromCache, x - radiusOfCanvas, y - radiusOfCanvas);
         return;
      }

      /**
       * Render
       */

      // eslint-disable-next-line
      const offscreenCanvas = document.createElement("canvas");
      // const offscreenCanvas =
      // new OffscreenCanvas(diameterOfCanvas, diameterOfCanvas) as HTMLCanvasElement;
      offscreenCanvas.width = diameterOfCanvas;
      offscreenCanvas.height = diameterOfCanvas;
      const newCtx = offscreenCanvas.getContext("2d")!;
      
      // Note: I think even numbers can be problematic here and make a rotated image not be exact.
      newCtx.translate(radiusOfCanvas, radiusOfCanvas);
      newCtx.rotate(rotation * Math.PI / 180);
      newCtx.filter = this.deriveFilterFromColor(color);
      newCtx.drawImage(img, -radius, -radius, diameter, diameter);
      // newCtx.filter = "none";
      
      // Render to the "real" canvas
      params.ctx.drawImage(offscreenCanvas, x - radiusOfCanvas, y - radiusOfCanvas);
      
      /**
       * Save to cache
       */
      
      this.cache.add(key, offscreenCanvas);
   };

   /**
    * TODO: Update comment.
    * Other actions accumulate changes. It is here where the rendering happens.
    * Read the state and render.
    */
   public render = (params: TRenderParams) => {
      const { data: { shape } } = params;
   
      switch(shape) {
         case "none":
            break;
         case "circle":
         case "square":
         case "triangle":
         case "diamondShield":
         case "octagon":
            images && this.drawImage(images[shape], params);
            break;
         case "explosion":
         case "roundExplosion":
            images && this.drawImage(images[shape], params);
            break;
         default:
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error(`CanvasGfxElement: unhandled shape '${shape}'`);
      }
   };
}