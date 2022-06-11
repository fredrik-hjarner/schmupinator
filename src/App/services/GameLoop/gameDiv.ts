import { resolutionHeight, resolutionWidth, zIndices } from "../../../consts";
import { px } from "../../../utils/px";

export const initGameDiv = () => {
   const gameDiv: HTMLDivElement = window.document.querySelector("#game") as HTMLDivElement;
   gameDiv.style.height = `${resolutionHeight}px`;
   gameDiv.style.width = `${resolutionWidth}px`;
   gameDiv.style.backgroundColor = "black";
   gameDiv.style.position = "fixed";
   gameDiv.style.top = "0px";
   gameDiv.style.left = "0px";
   //bg
   gameDiv.style.backgroundImage = `url("./bg.jpg")`;
   gameDiv.style.backgroundSize = "contain";
   gameDiv.style.backgroundOrigin = "padding-box";
   gameDiv.style.backgroundRepeat = "repeat-y";
   gameDiv.style.backgroundPositionY = "0px";
   return gameDiv;
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