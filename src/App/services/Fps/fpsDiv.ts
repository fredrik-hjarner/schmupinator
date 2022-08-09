import { resolutionHeight, zIndices } from "../../../consts";
import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { px } from "../../../utils/px";

export const initFpsDiv = () => {
   return BrowserDriver.WithWindow(window => {
      const element = window.document.createElement("div");
      element.style.position = "fixed";
      element.style.top = px(resolutionHeight);
      element.style.left = "155px";
      element.style.zIndex = zIndices.ui;

      window.document.body.appendChild(element);

      return element;
   });
};

export const initMaxWebWorkersDiv = () => {
   return BrowserDriver.WithWindow(window => {
      const element = window.document.createElement("div");
      element.style.position = "fixed";
      element.style.top = px(resolutionHeight);
      element.style.left = "223px";
      element.style.zIndex = zIndices.ui;

      window.document.body.appendChild(element);

      return element;
   });
};