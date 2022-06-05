import { resolutionHeight, resolutionWidth } from "../../../consts";

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