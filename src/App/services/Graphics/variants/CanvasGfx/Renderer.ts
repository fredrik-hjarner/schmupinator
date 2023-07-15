import type { GfxElementData } from "./GfxElementData";

import { BrowserDriver } from "../../../../../drivers/BrowserDriver";
// resources
const circle = "/images/circle.png";
const square = "/images/square.png";
const triangle = "/images/triangle.png";
const diamondShield = "/images/diamondShield.png";
const octagon = "/images/octagon.png";
const explosion = "/images/explosion.png";
const roundExplosion = "/images/roundExplosion.png";

type TRenderParams = {
   ctx?: CanvasRenderingContext2D;
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
      const { ctx, data: gfxElement } = params;
      const { color, rotation, diameter } = gfxElement;
   
      if(ctx === undefined) { return; }

      const radius = Math.round(diameter/2);
      const x = Math.round(gfxElement.x);
      const y = Math.round(gfxElement.y);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.filter = this.deriveFilterFromColor(color);

      ctx.drawImage(img, -radius, -radius, diameter, diameter);
      
      ctx.filter = "none";
      ctx.restore();
   };

   /**
    * TODO: Update comment.
    * Other actions accumulate changes. It is here where the rendering happens.
    * Read the state and render.
    */
   public render = (params: TRenderParams) => {
      const { ctx, data: { shape } } = params;
   
      if(ctx === undefined) { return; }

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