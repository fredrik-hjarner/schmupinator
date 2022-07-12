import { resolutionHeight, resolutionWidth, zIndices } from "../../../../../consts";
import { BrowserDriver } from "../../../../../drivers/BrowserDriver";
import { px } from "../../../../../utils/px";

export const createShade = () => {
   return BrowserDriver.WithWindow(window => {
      const element = window.document.createElement("div");

      element.style.position = "fixed";
      element.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      element.style.top = px(0);
      element.style.left = px(0);
      element.style.width = px(resolutionWidth);
      element.style.height = px(resolutionHeight);
      element.style.zIndex = zIndices.ui;

      window.document.body.appendChild(element);
      
      return element;
   }) as HTMLDivElement;
};