import { resolutionHeight, resolutionWidth, zIndices } from "../../../consts";
import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { px } from "../../../utils/px";

export const initGameHideBottom = () => {
   return BrowserDriver.WithWindow(window => {
      const element: HTMLDivElement =
         window.document.querySelector("#gameHideBottom") as HTMLDivElement;
      element.style.height = px(1000);
      element.style.width = px(resolutionWidth);
      element.style.position = "fixed";
      element.style.top = px(resolutionHeight);
      element.style.left = px(0);
      element.style.backgroundColor = "white";
      element.style.zIndex = zIndices.gameHide;
      return element;
   });
};

export const initGameHideRight = () => {
   return BrowserDriver.WithWindow(window => {
      const element: HTMLDivElement =
         window.document.querySelector("#gameHideRight") as HTMLDivElement;
      element.style.height = px(1000);
      element.style.width = px(1000);
      element.style.position = "fixed";
      element.style.top = px(0);
      element.style.left = px(resolutionWidth);
      element.style.backgroundColor = "white";
      element.style.zIndex = zIndices.gameHide;
      return element;
   });
};