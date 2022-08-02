import { resolutionHeight, zIndices } from "../../../consts";
import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { px } from "../../../utils/px";

export const initGameSpeedElement = () => {
   return BrowserDriver.WithWindow(window => {
      const element: HTMLInputElement =
         window.document.querySelector("#speedUp") as HTMLInputElement;
      element.style.position = "fixed";
      element.style.top = px(resolutionHeight+50);
      element.style.left = px(5);
      element.value = "1";
      element.style.zIndex = zIndices.controlsAndLogs;
      return element;
   });
};