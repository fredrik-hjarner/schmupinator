import { resolutionHeight, resolutionWidth } from "../../../consts";
import { BrowserDriver } from "../../../drivers/BrowserDriver";
import layer1 from "../../../assets/images/layer1.png";
import layer2 from "../../../assets/images/layer2.png";
import layer3 from "../../../assets/images/layer3.png";

export const initLayer1Element = () => {
   return BrowserDriver.WithWindow(window => {
      const element: HTMLDivElement = window.document.querySelector("#layer1") as HTMLDivElement;
      element.style.height = `${resolutionHeight}px`;
      element.style.width = `${resolutionWidth}px`;
      element.style.backgroundColor = "black";
      element.style.position = "fixed";
      element.style.top = "0px";
      element.style.left = "0px";
      //bg
      element.style.backgroundImage = `url("${layer1}")`;
      element.style.backgroundSize = "contain";
      element.style.backgroundOrigin = "padding-box";
      element.style.backgroundRepeat = "repeat-y";
      element.style.backgroundPositionY = "0px";
      return element;
   });
};

export const initLayer2Element = () => {
   return BrowserDriver.WithWindow(window => {
      const element: HTMLDivElement = window.document.querySelector("#layer2") as HTMLDivElement;
      element.style.height = `${resolutionHeight}px`;
      element.style.width = `${resolutionWidth}px`;
      element.style.backgroundColor = "unset";
      element.style.position = "fixed";
      element.style.top = "0px";
      element.style.left = "0px";
      //bg
      element.style.backgroundImage = `url("${layer2}")`;
      element.style.backgroundSize = "contain";
      element.style.backgroundOrigin = "padding-box";
      element.style.backgroundRepeat = "repeat-y";
      element.style.backgroundPositionY = "0px";
      return element;
   });
};

export const initLayer3Element = () => {
   return BrowserDriver.WithWindow(window => {
      const element: HTMLDivElement = window.document.querySelector("#layer3") as HTMLDivElement;
      element.style.height = `${resolutionHeight}px`;
      element.style.width = `${resolutionWidth}px`;
      element.style.backgroundColor = "unset";
      element.style.position = "fixed";
      element.style.top = "0px";
      element.style.left = "0px";
      //bg
      element.style.backgroundImage = `url("${layer3}")`;
      element.style.backgroundSize = "contain";
      element.style.backgroundOrigin = "padding-box";
      element.style.backgroundRepeat = "repeat-y";
      element.style.backgroundPositionY = "0px";
      return element;
   });
};