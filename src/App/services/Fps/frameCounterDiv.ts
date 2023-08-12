import { resolutionHeight, zIndices } from "../../../consts.ts";
import { BrowserDriver } from "../../../drivers/BrowserDriver/index.ts";
import { px } from "../../../utils/px.ts";

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