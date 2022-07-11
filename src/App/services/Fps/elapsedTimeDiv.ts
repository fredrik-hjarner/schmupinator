import { resolutionHeight, zIndices } from "../../../consts";
import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { px } from "../../../utils/px";

export const initElapsedTimeDiv = () => {
   return BrowserDriver.WithWindow(window => {
      const element: HTMLDivElement =
         window.document.querySelector("#elapsedTimeDiv") as HTMLDivElement;
      element.style.position = "fixed";
      element.style.top = px(resolutionHeight + 20);
      element.style.left = "0px";
      element.style.zIndex = zIndices.controlsAndLogs;
      return element;
   });
};