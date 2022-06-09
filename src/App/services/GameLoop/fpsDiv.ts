import { resolutionHeight, zIndices } from "../../../consts";
import { px } from "../../../utils/px";

export const initFpsDiv = () => {
   const element: HTMLDivElement = window.document.querySelector("#fpsDiv") as HTMLDivElement;
   element.style.position = "fixed";
   element.style.top = px(resolutionHeight + 40);
   element.style.left = "0px";
   element.style.zIndex = zIndices.controlsAndLogs;
   return element;
};