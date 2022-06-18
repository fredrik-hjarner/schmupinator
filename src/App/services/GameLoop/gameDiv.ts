import { resolutionHeight, resolutionWidth, zIndices } from "../../../consts";
import { px } from "../../../utils/px";

export const initLayer1Element = () => {
   const element: HTMLDivElement = window.document.querySelector("#layer1") as HTMLDivElement;
   element.style.height = `${resolutionHeight}px`;
   element.style.width = `${resolutionWidth}px`;
   element.style.backgroundColor = "black";
   element.style.position = "fixed";
   element.style.top = "0px";
   element.style.left = "0px";
   //bg
   element.style.backgroundImage = `url("./layer1.png")`;
   element.style.backgroundSize = "contain";
   element.style.backgroundOrigin = "padding-box";
   element.style.backgroundRepeat = "repeat-y";
   element.style.backgroundPositionY = "0px";
   return element;
};

export const initLayer2Element = () => {
   const element: HTMLDivElement = window.document.querySelector("#layer2") as HTMLDivElement;
   element.style.height = `${resolutionHeight}px`;
   element.style.width = `${resolutionWidth}px`;
   element.style.backgroundColor = "none";
   element.style.position = "fixed";
   element.style.top = "0px";
   element.style.left = "0px";
   //bg
   element.style.backgroundImage = `url("./layer2.png")`;
   element.style.backgroundSize = "contain";
   element.style.backgroundOrigin = "padding-box";
   element.style.backgroundRepeat = "repeat-y";
   element.style.backgroundPositionY = "0px";
   return element;
};

export const initLayer3Element = () => {
   const element: HTMLDivElement = window.document.querySelector("#layer3") as HTMLDivElement;
   element.style.height = `${resolutionHeight}px`;
   element.style.width = `${resolutionWidth}px`;
   element.style.backgroundColor = "none";
   element.style.position = "fixed";
   element.style.top = "0px";
   element.style.left = "0px";
   //bg
   element.style.backgroundImage = `url("./layer3.png")`;
   element.style.backgroundSize = "contain";
   element.style.backgroundOrigin = "padding-box";
   element.style.backgroundRepeat = "repeat-y";
   element.style.backgroundPositionY = "0px";
   return element;
};

export const initGameHideBottom = () => {
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
};

export const initGameHideRight = () => {
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
};