import { resolutionHeight, resolutionWidth, zIndices } from "../../../../../../consts";
import { BrowserDriver } from "../../../../../../drivers/BrowserDriver";
import { px } from "../../../../../../utils/px";

const menuBackground = "/images/menuBackground.png";

/**
 * TODO: Originally this was just a 0.7 opacity black div, but I wanted to use a background image.
 * changed this 2023-07-13.
 */
export const createShade = () => {
   return BrowserDriver.WithWindow(window => {
      const element = window.document.createElement("div");

      element.style.position = "fixed";
      element.style.backgroundImage = `url('${menuBackground}')`;
      element.style.filter = "brightness(70%)";
      element.style.backgroundSize = "cover";
      element.style.top = px(0);
      element.style.left = px(0);
      element.style.width = px(resolutionWidth);
      element.style.height = px(resolutionHeight);
      element.style.zIndex = zIndices.ui;

      window.document.body.appendChild(element);
      
      return element;
   })!;
};