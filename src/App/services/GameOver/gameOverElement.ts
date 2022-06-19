import { resolutionHeight, resolutionWidth } from "../../../consts";
import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { px } from "../../../utils/px";

export const initGameOverElement = () => {
   return BrowserDriver.WithWindow(window => {
      const element: HTMLDivElement =
         window.document.querySelector("#gameOverDiv") as HTMLDivElement;
      element.style.position = "fixed";
      element.style.top = px(0);
      element.style.left = px(0);
      element.style.width = px(resolutionWidth);
      element.style.height = px(resolutionHeight);
      element.style.visibility = "hidden";
      element.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      element.style.color = "white";
      element.style.fontSize = px(30);
      element.style.zIndex = "2"; // on toppest.
      return element;
   });
};