import { resolutionHeight, resolutionWidth, zIndices } from "../../../../../../consts.ts";
import { BrowserDriver } from "../../../../../../drivers/BrowserDriver/index.ts";
import { px } from "../../../../../../utils/px.ts";

/**
 * Full screen bg image.
 */
export const createBgImage = (imageUrl: string) => {
   return BrowserDriver.WithWindow(window => {
      const element = window.document.createElement("div");

      element.style.position = "fixed";
      element.style.backgroundImage = `url('${imageUrl}')`;
      element.style.backgroundSize = "cover";
      element.style.top = px(0);
      element.style.left = px(0);
      element.style.width = px(resolutionWidth);
      element.style.height = px(resolutionHeight);
      element.style.zIndex = zIndices.ui;

      window.document.body.appendChild(element);
      
      return element;
   })!;
};