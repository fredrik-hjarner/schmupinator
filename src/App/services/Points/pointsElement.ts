import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { px } from "../../../utils/px";

export const initPointsElement = () => {
   return BrowserDriver.WithWindow(window => {    
      const element: HTMLDivElement =
         window.document.querySelector("#pointsDiv") as HTMLDivElement;
      element.style.position = "fixed";
      element.style.top = px(10);
      element.style.left = px(20);
      element.style.color = "white";
      element.style.fontSize = px(16);
      element.style.zIndex = "1"; // on top.
      element.innerHTML = "0";
      return element;
   });
};