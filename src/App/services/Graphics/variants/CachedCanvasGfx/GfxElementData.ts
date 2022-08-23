import type { TShape } from "../../IGraphics";

export class GfxElementData {
   public x = 100; // Not sure what a reasonable default value is.
   public y = 100; // Not sure what a reasonable default value is.
   public scale = 1; // TODO: This seems to be unused. Unclear purpose.
   public rotation = 0; // degrees
   public shape: TShape = "circle"; // TODO: "none" seems like a more reasonable default??
   public color = "red";
   public diameter = 5;

   public get radius() { return this.diameter/2; }
   public get radiusRounded() { return Math.round(this.diameter/2); }
   public get left() { return Math.round(this.x - this.radius); }
   public get top() { return Math.round(this.y - this.radius); }

   // Supposed to be used in a gfx cache to uniquely identify a rendering of this element.
   public get serialized(): string {
      /**
       * TODO: This could prolly be compacted. Dunno if it would improve performance,
       * but I just need something that uniquely identifies a "rendering of a gfx element".
       */
      return JSON.stringify({
         rotation: this.rotation,
         shape: this.shape,
         color: this.color,
         diameter: this.diameter,
      });
   }
}