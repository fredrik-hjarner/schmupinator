import type { TShape } from "../../IGraphics";

export class GfxElementData {
   public x = 100; // Not sure what a reasonable default value is.
   public y = 100; // Not sure what a reasonable default value is.
   public scale = 1; // TODO: This seems to be unused. Unclear purpose.
   public rotation = 0; // degrees
   public shape: TShape = "circle"; // TODO: "none" seems like a more reasonable default??
   public color = "red";
   public diameter = 5;
}