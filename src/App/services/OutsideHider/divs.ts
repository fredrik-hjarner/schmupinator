import { resolutionHeight, resolutionWidth, zIndices } from "../../../consts.ts";
import { BrowserDriver } from "../../../drivers/BrowserDriver/index.ts";
import { px } from "../../../utils/px.ts";

export const initGameHideBottom = () => {
   return BrowserDriver.WithWindow(window => {
      const element = window.document.createElement("div");
      element.style.height = px(1000);
      element.style.width = px(resolutionWidth);
      element.style.position = "fixed";
      element.style.top = px(resolutionHeight);
      element.style.left = px(0);
      element.style.backgroundColor = "white";
      element.style.zIndex = zIndices.gameHide;

      window.document.body.appendChild(element);

      return element;
   });
};

export const initGameHideRight = () => {
   return BrowserDriver.WithWindow(window => {
      const element = window.document.createElement("div");
      element.style.height = px(1000);
      element.style.width = px(1000);
      element.style.position = "fixed";
      element.style.top = px(0);
      element.style.left = px(resolutionWidth);
      element.style.backgroundColor = "white";
      element.style.zIndex = zIndices.gameHide;

      window.document.body.appendChild(element);

      return element;
   });
};