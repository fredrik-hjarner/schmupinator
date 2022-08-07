import { resolutionHeight, zIndices } from "../../../consts";
import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { px } from "../../../utils/px";

export const initFpsDiv = () => {
   return BrowserDriver.WithWindow(window => {
      const element: HTMLDivElement = window.document.querySelector("#fpsDiv") as HTMLDivElement;
      element.style.position = "fixed";
      element.style.top = px(resolutionHeight);
      element.style.left = "155px";
      element.style.zIndex = zIndices.controlsAndLogs;
      return element;
   });
};