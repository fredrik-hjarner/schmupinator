import { resolutionHeight, zIndices } from "../../../consts";
import { px } from "../../../utils/px";

export const initFrameCounterDiv = () => {
   const element: HTMLDivElement =
    window.document.querySelector("#frameCounter") as HTMLDivElement;
   element.style.position = "fixed";
   element.style.top = px(resolutionHeight);
   element.style.left = "0px";
   element.style.zIndex = zIndices.controlsAndLogs;
   return element;
};