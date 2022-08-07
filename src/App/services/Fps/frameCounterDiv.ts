import { resolutionHeight, zIndices } from "../../../consts";
import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { px } from "../../../utils/px";

export const initFrameCounterDiv = () => {
   return BrowserDriver.WithWindow(window => {
      const element = window.document.createElement("div");
      element.style.position = "fixed";
      element.style.top = px(resolutionHeight);
      element.style.left = "5px";
      element.style.zIndex = zIndices.ui;

      window.document.body.appendChild(element);

      return element;
   });
};