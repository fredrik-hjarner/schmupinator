import type { ICursorShowGamePos } from "./ICursorShowGamePos";
import type { TInitParams } from "../IService";
import type { IFullscreen } from "../Fullscreen/IFullscreen";

import { BrowserDriver } from "../../../drivers/BrowserDriver";

type TConstructor = {
   name: string;
}

export class CursorShowGamePos implements ICursorShowGamePos {
   // vars
   public readonly name: string;

   // deps/services
   public fullscreen!: IFullscreen; // needs `scale` from Fullscreen to position tooltip when scaled

   // elements
   private tooltip: HTMLDivElement | null;

   /**
    * Public
    */
   public constructor({ name }: TConstructor) {
      this.name = name;
      this.tooltip = null;
   }
   
   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      // TODO: Better type checking.
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      this.fullscreen = deps?.fullscreen!;
      this.tooltip = this.createCursorTooltip();
   };

   public destroy = () => {
      this.removeCursorTooltip();
   };

   /**
    * Private
    */
   private createCursorTooltip = (): HTMLDivElement => {
      return BrowserDriver.WithWindow(window => {
         const document = window.document;
         // Create the tooltip element
         const tooltip = document.createElement("div");
         tooltip.id = "tooltip";
         document.body.appendChild(tooltip);

         // Apply styles to the tooltip
         tooltip.style.position = "absolute";
         tooltip.style.fontSize = "13px";
         tooltip.style.display = "none";
         tooltip.style.backgroundColor = "#333";
         tooltip.style.color = "#fff";
         tooltip.style.zIndex = "3";

         // Add event listener to track mouse movement
         document.addEventListener("mousemove", this.updateTooltip);

         // Hide the tooltip when the mouse leaves the window
         document.addEventListener("mouseleave", this.hideTooltip);

         return tooltip;
      })!;
   };

   private updateTooltip = (event: MouseEvent): void => {
      const scale = this.fullscreen.scale;

      // Get the x and y coordinates of the cursor
      const x: number = event.clientX;
      const y: number = event.clientY;

      // Update the tooltip position and text
      if (this.tooltip) {
         this.tooltip.style.display = "block";
         this.tooltip.style.left = `${(x + 5)/scale}px`;
         this.tooltip.style.top = `${(y + 5)/scale}px`;
         this.tooltip.textContent = `X: ${Math.round(x/scale)}, Y: ${Math.round(y/scale)}`;
      }
   };

   private hideTooltip = (): void => {
      if (this.tooltip) {
         this.tooltip.style.display = "none";
      }
   };

   private removeCursorTooltip = (): void => {
      BrowserDriver.WithWindow(window => {
         const document = window.document;

         // Remove event listeners
         document.removeEventListener("mousemove", this.updateTooltip);
         document.removeEventListener("mouseleave", this.hideTooltip);
         
         // Remove the tooltip element
         if (this.tooltip?.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
            this.tooltip = null;
         }
      });
   };
}
